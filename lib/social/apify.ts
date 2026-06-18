import type { SocialPlatform } from '../ai/types'

export type ApifySocialPlatform = Extract<SocialPlatform, 'youtube' | 'instagram' | 'x' | 'telegram'>

export interface SocialDataRequest {
  urlOrHandle: string
  maxItems?: number
}

export interface NormalizedSocialProfile {
  platform: ApifySocialPlatform
  input: string
  username: string
  displayName: string
  canonicalUrl?: string
  bio?: string
  avatarUrl?: string
  website?: string
  followers: number
  following: number
  posts: number
  totalViews: number
  averageViews: number
  engagementRate: number
  growthRate: number
  trustScore: number
  verified: boolean
  businessCategory?: string
  scrapedAt: string
}

export interface NormalizedSocialPost {
  id: string
  url?: string
  type?: string
  title?: string
  content: string
  publishedAt?: string
  likes: number
  comments: number
  shares: number
  views: number
  mediaUrls: string[]
  thumbnailUrl?: string
  hashtags: string[]
  mentions: string[]
  engagementRate: number
}

export interface NormalizedSocialData {
  platform: ApifySocialPlatform
  source: 'apify'
  query: string
  actorId: string
  profile: NormalizedSocialProfile
  posts: NormalizedSocialPost[]
  metrics: {
    audienceSize: number
    contentVolume: number
    totalEngagements: number
    averageEngagements: number
    totalViews: number
    averageViews: number
    engagementRate: number
    growthScore: number
    trustScore: number
  }
  rawItemCount: number
  warnings: string[]
}

type RawRecord = Record<string, any>

const DEFAULT_MAX_ITEMS = 24

const DEFAULT_ACTORS: Record<ApifySocialPlatform, string> = {
  youtube: 'streamers/youtube-scraper',
  instagram: 'apify/instagram-profile-scraper',
  x: 'apidojo/tweet-scraper',
  telegram: 'curious_coder/telegram-scraper',
}

const ACTOR_ENV_KEYS: Record<ApifySocialPlatform, string> = {
  youtube: 'APIFY_YOUTUBE_ACTOR_ID',
  instagram: 'APIFY_INSTAGRAM_ACTOR_ID',
  x: 'APIFY_TWITTER_ACTOR_ID',
  telegram: 'APIFY_TELEGRAM_ACTOR_ID',
}

export function isApifyConfigured(): boolean {
  return Boolean(getApifyToken())
}

export async function getYoutubeData(urlOrHandle: string, maxItems = DEFAULT_MAX_ITEMS): Promise<NormalizedSocialData> {
  return getSocialData('youtube', { urlOrHandle, maxItems })
}

export async function getInstagramData(urlOrHandle: string, maxItems = DEFAULT_MAX_ITEMS): Promise<NormalizedSocialData> {
  return getSocialData('instagram', { urlOrHandle, maxItems })
}

export async function getTwitterData(urlOrHandle: string, maxItems = DEFAULT_MAX_ITEMS): Promise<NormalizedSocialData> {
  return getSocialData('x', { urlOrHandle, maxItems })
}

export async function getTelegramData(urlOrHandle: string, maxItems = DEFAULT_MAX_ITEMS): Promise<NormalizedSocialData> {
  return getSocialData('telegram', { urlOrHandle, maxItems })
}

export async function getSocialData(
  platform: ApifySocialPlatform,
  request: SocialDataRequest
): Promise<NormalizedSocialData> {
  const actorId = getActorId(platform)
  const target = normalizeTarget(platform, request.urlOrHandle)
  const maxItems = Math.min(Math.max(request.maxItems || DEFAULT_MAX_ITEMS, 1), 100)
  const rawItems = await runApifyActor(actorId, buildActorInput(platform, target, maxItems))

  return normalizeSocialData({
    platform,
    actorId,
    query: request.urlOrHandle,
    normalizedUrl: target.url,
    username: target.username,
    rawItems,
    maxItems,
  })
}

export async function fetchApifyTaskStatus(taskId: string) {
  const token = getApifyToken()
  if (!token) {
    throw new Error('Apify is not configured. Set APIFY_API_KEY in your environment.')
  }

  const response = await fetch(`https://api.apify.com/v2/actor-tasks/${encodeURIComponent(taskId)}?token=${encodeURIComponent(token)}`)
  if (!response.ok) {
    throw new Error(`Apify task status failed (${response.status}): ${await response.text()}`)
  }

  const payload = await response.json()
  return {
    taskId,
    status: payload?.data?.status || 'unknown',
    description: payload?.data?.title || payload?.data?.name || 'Apify task',
    lastRun: payload?.data?.stats?.lastRunStartedAt || payload?.data?.modifiedAt || new Date().toISOString(),
  }
}

async function runApifyActor(actorId: string, input: RawRecord): Promise<RawRecord[]> {
  const token = getApifyToken()
  if (!token) {
    throw new Error('Apify is not configured. Set APIFY_API_KEY in your environment.')
  }

  const actorPath = actorId.replace('/', '~')
  const url = new URL(`https://api.apify.com/v2/acts/${actorPath}/run-sync-get-dataset-items`)
  url.searchParams.set('token', token)
  url.searchParams.set('format', 'json')
  url.searchParams.set('clean', 'true')

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Apify actor ${actorId} failed (${response.status}): ${body.slice(0, 800)}`)
  }

  const data = await response.json()
  if (Array.isArray(data)) return data.filter(isRecord)
  if (Array.isArray(data?.items)) return data.items.filter(isRecord)
  if (isRecord(data)) return [data]
  return []
}

function buildActorInput(
  platform: ApifySocialPlatform,
  target: { url: string; username: string },
  maxItems: number
): RawRecord {
  const startUrls = [{ url: target.url }]

  switch (platform) {
    case 'youtube':
      return {
        startUrls,
        maxResults: maxItems,
        maxVideos: maxItems,
        sortVideosBy: 'NEWEST',
        includeChannelInfo: true,
      }
    case 'instagram':
      return {
        directUrls: [target.url],
        resultsType: 'details',
        resultsLimit: maxItems,
        addParentData: false,
      }
    case 'x':
      return {
        urls: [target.url],
        sort: 'Latest',
        maxItems,
      }
    case 'telegram':
      return {
        channelUrls: [target.url],
        limit: maxItems,
        maxItems,
      }
  }
}

function normalizeSocialData(params: {
  platform: ApifySocialPlatform
  actorId: string
  query: string
  normalizedUrl: string
  username: string
  rawItems: RawRecord[]
  maxItems: number
}): NormalizedSocialData {
  const profileItem = chooseProfileItem(params.rawItems)
  const followers = pickNumber(profileItem, [
    'followers',
    'followersCount',
    'followerCount',
    'subscribers',
    'subscriberCount',
    'channelSubscribers',
    'user.followers_count',
    'user.followersCount',
    'author.followersCount',
    'owner.followersCount',
    'profile.followers',
  ])
  const following = pickNumber(profileItem, [
    'following',
    'followingCount',
    'followsCount',
    'friendsCount',
    'user.following_count',
    'profile.following',
  ])
  let rawPosts = params.rawItems
  if (params.platform === 'instagram') {
    rawPosts = Array.isArray(profileItem.mediaPosts) ? profileItem.mediaPosts : []
    if (rawPosts.length === 0) {
      rawPosts = Array.isArray(profileItem.latestPosts) ? profileItem.latestPosts : []
    }
    const igtv = Array.isArray(profileItem.latestIgtvVideos) ? profileItem.latestIgtvVideos : []
    rawPosts = [...rawPosts, ...igtv]
  }

  const posts = rawPosts
    .map((item, index) => normalizePost(item, followers, index))
    .filter((post) => post.content || post.title || post.url)
    .slice(0, params.maxItems)

  const totalViews = posts.reduce((sum, post) => sum + post.views, 0)
  const totalEngagements = posts.reduce((sum, post) => sum + post.likes + post.comments + post.shares, 0)
  const averageEngagements = posts.length ? Math.round(totalEngagements / posts.length) : 0
  const averageViews = posts.length ? Math.round(totalViews / posts.length) : 0
  const engagementRate = followers > 0 ? roundPercent((averageEngagements / followers) * 100) : 0
  const growthScore = calculateGrowthScore({ followers, posts: posts.length, engagementRate, averageViews })
  const trustScore = calculateTrustScore(profileItem, followers, engagementRate)
  const warnings: string[] = []

  if (params.rawItems.length === 0) {
    warnings.push('Apify returned no records for this profile.')
  }
  if (!followers) {
    warnings.push('Follower/subscriber count was not available from the scraper output.')
  }

  const profile: NormalizedSocialProfile = {
    platform: params.platform,
    input: params.query,
    username: pickString(profileItem, [
      'username',
      'userName',
      'handle',
      'screenName',
      'channelHandle',
      'channelUsername',
      'ownerUsername',
      'author.username',
      'user.username',
    ]) || params.username,
    displayName: pickString(profileItem, [
      'displayName',
      'fullName',
      'name',
      'channelName',
      'authorName',
      'title',
      'user.name',
      'profile.name',
    ]) || params.username,
    canonicalUrl: pickString(profileItem, ['url', 'profileUrl', 'channelUrl', 'inputUrl']) || params.normalizedUrl,
    bio: pickString(profileItem, ['bio', 'biography', 'description', 'channelDescription', 'about', 'profile.bio']),
    avatarUrl: pickString(profileItem, ['avatar', 'avatarUrl', 'profilePicUrl', 'profilePictureUrl', 'thumbnailUrl', 'image']),
    website: pickString(profileItem, ['website', 'externalUrl', 'homepage', 'urlBio', 'links.0.url']),
    followers,
    following,
    posts: pickNumber(profileItem, ['posts', 'postsCount', 'mediaCount', 'statusesCount', 'videosCount']) || posts.length,
    totalViews,
    averageViews,
    engagementRate,
    growthRate: 0,
    trustScore,
    verified: pickBoolean(profileItem, ['verified', 'isVerified', 'is_blue_verified', 'isBlueVerified']),
    businessCategory: pickString(profileItem, ['businessCategoryName', 'businessCategory', 'categoryName']),
    scrapedAt: new Date().toISOString(),
  }

  return {
    platform: params.platform,
    source: 'apify',
    query: params.query,
    actorId: params.actorId,
    profile,
    posts,
    metrics: {
      audienceSize: followers,
      contentVolume: posts.length,
      totalEngagements,
      averageEngagements,
      totalViews,
      averageViews,
      engagementRate,
      growthScore,
      trustScore,
    },
    rawItemCount: params.rawItems.length,
    warnings,
  }
}

function normalizePost(item: RawRecord, followers: number, index: number): NormalizedSocialPost {
  const likes = pickNumber(item, ['likes', 'likesCount', 'likeCount', 'favoriteCount', 'favorites', 'statistics.likeCount'])
  const comments = pickNumber(item, ['comments', 'commentsCount', 'commentCount', 'replyCount', 'replies', 'statistics.commentCount'])
  const shares = pickNumber(item, ['shares', 'shareCount', 'retweetCount', 'retweets', 'reposts', 'statistics.shareCount'])
  const views = pickNumber(item, ['views', 'viewCount', 'videoViewCount', 'playCount', 'statistics.viewCount'])
  const engagements = likes + comments + shares
  
  const mediaUrls = pickStringArray(item, ['mediaUrls', 'images', 'displayUrl', 'videoUrl'])
  const thumbnailUrl = pickString(item, ['thumbnailUrl', 'displayUrl', 'images.0', 'mediaUrls.0']) || mediaUrls[0]

  return {
    id: pickString(item, ['id', 'postId', 'videoId', 'tweetId', 'shortCode', 'messageId']) || `post_${index + 1}`,
    url: pickString(item, ['url', 'postUrl', 'videoUrl', 'tweetUrl', 'link']),
    type: pickString(item, ['type', 'postType', '__typename']),
    title: pickString(item, ['title', 'videoTitle', 'headline']),
    content: pickString(item, ['text', 'fullText', 'caption', 'description', 'message', 'content', 'title']) || '',
    publishedAt: normalizeDate(pickString(item, ['timestamp', 'createdAt', 'date', 'publishedAt', 'publishedTime', 'takenAt'])),
    likes,
    comments,
    shares,
    views,
    mediaUrls,
    thumbnailUrl,
    hashtags: extractHashtags(item),
    mentions: pickStringArray(item, ['mentions']),
    engagementRate: followers > 0 ? roundPercent((engagements / followers) * 100) : 0,
  }
}

function normalizeTarget(platform: ApifySocialPlatform, input: string): { url: string; username: string } {
  const trimmed = input.trim()
  if (!trimmed) return { url: '', username: '' }

  if (/^https?:\/\//i.test(trimmed)) {
    return { url: trimmed, username: extractUsername(platform, trimmed) }
  }

  const username = trimmed.replace(/^@/, '').replace(/^#/, '').replace(/^t\.me\//i, '').replace(/^x\.com\//i, '').replace(/^twitter\.com\//i, '')
  switch (platform) {
    case 'youtube':
      return {
        url: username.startsWith('UC') ? `https://www.youtube.com/channel/${username}` : `https://www.youtube.com/@${username}`,
        username,
      }
    case 'instagram':
      return { url: `https://www.instagram.com/${username}/`, username }
    case 'x':
      return { url: `https://x.com/${username}`, username }
    case 'telegram':
      return { url: `https://t.me/${username}`, username }
  }
}

function extractUsername(platform: ApifySocialPlatform, value: string): string {
  try {
    const url = new URL(value)
    const segments = url.pathname.split('/').filter(Boolean)
    if (platform === 'youtube') {
      return segments.find((segment) => segment.startsWith('@'))?.replace('@', '') || segments.at(-1) || ''
    }
    if (platform === 'telegram' && url.hostname === 't.me') {
      return segments[0] || ''
    }
    return (segments[0] || '').replace('@', '')
  } catch {
    return value.replace(/^@/, '')
  }
}

function getActorId(platform: ApifySocialPlatform): string {
  return process.env[ACTOR_ENV_KEYS[platform]]?.trim() || DEFAULT_ACTORS[platform]
}

function getApifyToken(): string {
  return process.env.APIFY_API_KEY?.trim() || process.env.APIFY_TOKEN?.trim() || ''
}

function chooseProfileItem(items: RawRecord[]): RawRecord {
  return items.find((item) => {
    return pickNumber(item, ['followers', 'followersCount', 'subscriberCount', 'subscribers']) > 0
      || pickString(item, ['bio', 'biography', 'channelDescription', 'profileUrl'])
  }) || items[0] || {}
}

function isRecord(value: unknown): value is RawRecord {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}

function pickString(item: RawRecord, paths: string[]): string {
  for (const path of paths) {
    const value = getValue(item, path)
    if (typeof value === 'string' && value.trim()) return value.trim()
    if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  }
  return ''
}

function pickNumber(item: RawRecord, paths: string[]): number {
  for (const path of paths) {
    const value = getValue(item, path)
    const parsed = toNumber(value)
    if (parsed > 0) return parsed
  }
  return 0
}

function pickBoolean(item: RawRecord, paths: string[]): boolean {
  for (const path of paths) {
    const value = getValue(item, path)
    if (typeof value === 'boolean') return value
    if (typeof value === 'string') return ['true', 'yes', '1'].includes(value.toLowerCase())
  }
  return false
}

function pickStringArray(item: RawRecord, paths: string[]): string[] {
  const values = new Set<string>()
  for (const path of paths) {
    const value = getValue(item, path)
    if (Array.isArray(value)) {
      value.forEach((entry) => {
        if (typeof entry === 'string' && entry.trim()) values.add(entry.trim())
        if (isRecord(entry)) {
          const url = pickString(entry, ['url', 'src', 'href'])
          if (url) values.add(url)
        }
      })
    } else if (typeof value === 'string' && value.trim()) {
      values.add(value.trim())
    }
  }
  return Array.from(values).slice(0, 8)
}

function extractHashtags(item: RawRecord): string[] {
  const values = new Set<string>()
  const explicit = getValue(item, 'hashtags')
  if (Array.isArray(explicit)) {
    explicit.forEach((tag) => {
      if (typeof tag === 'string') values.add(tag.replace(/^#/, ''))
    })
  }

  const text = pickString(item, ['text', 'caption', 'description', 'content'])
  for (const match of text.matchAll(/#([\p{L}\p{N}_]+)/gu)) {
    values.add(match[1])
  }
  return Array.from(values).slice(0, 20)
}

function getValue(item: RawRecord, path: string): unknown {
  return path.split('.').reduce<unknown>((current, key) => {
    if (!isRecord(current) && !Array.isArray(current)) return undefined
    if (Array.isArray(current)) {
      const index = Number(key)
      return Number.isInteger(index) ? current[index] : undefined
    }
    return current[key]
  }, item)
}

function toNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.max(0, Math.round(value))
  if (typeof value === 'string') {
    const normalized = value.toLowerCase().replace(/,/g, '').trim()
    const match = normalized.match(/^([\d.]+)\s*([kmb])?$/)
    if (!match) return 0
    const base = Number(match[1])
    if (!Number.isFinite(base)) return 0
    const multiplier = match[2] === 'k' ? 1_000 : match[2] === 'm' ? 1_000_000 : match[2] === 'b' ? 1_000_000_000 : 1
    return Math.max(0, Math.round(base * multiplier))
  }
  return 0
}

function sumNumbers(items: RawRecord[], paths: string[]): number {
  return items.reduce((sum, item) => sum + pickNumber(item, paths), 0)
}

function normalizeDate(value: string): string | undefined {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toISOString()
}

function calculateGrowthScore(input: {
  followers: number
  posts: number
  engagementRate: number
  averageViews: number
}): number {
  const audienceScore = input.followers >= 100_000 ? 35 : input.followers >= 10_000 ? 28 : input.followers >= 1_000 ? 20 : 10
  const contentScore = Math.min(25, input.posts * 2)
  const engagementScore = Math.min(25, Math.round(input.engagementRate * 5))
  const viewScore = input.averageViews > 0 && input.followers > 0 ? Math.min(15, Math.round((input.averageViews / input.followers) * 20)) : 0
  return clampScore(audienceScore + contentScore + engagementScore + viewScore)
}

function calculateTrustScore(item: RawRecord, followers: number, engagementRate: number): number {
  let score = 45
  if (pickBoolean(item, ['verified', 'isVerified', 'is_blue_verified', 'isBlueVerified'])) score += 20
  if (followers >= 10_000) score += 15
  if (engagementRate >= 1) score += 10
  if (pickString(item, ['bio', 'biography', 'description', 'channelDescription'])) score += 5
  if (pickString(item, ['website', 'externalUrl', 'homepage'])) score += 5
  return clampScore(score)
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function roundPercent(value: number): number {
  return Math.round(value * 100) / 100
}
