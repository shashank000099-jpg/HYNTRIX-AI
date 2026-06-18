// ============================================
// CENTRALIZED SOCIAL PLATFORM CONFIG
// ============================================
// Single configuration for all social intelligence platforms
// Every platform uses APIFY_API_KEY (no per-platform API keys)
// ============================================

import type { SocialPlatform } from '../ai/types'

export interface ApifyActorConfig {
  platform: SocialPlatform
  actorId: string
  displayName: string
  defaultLimit: number
  inputMapper: (identifier: string, limit?: number) => Record<string, any>
  profileMapper: (data: any, identifier: string) => {
    username: string
    displayName?: string
    bio?: string
    avatarUrl?: string
    followers: number
    following: number
    posts: number
    engagement: number
    growth: number
    trustScore: number
    verified: boolean
    externalWebsite?: string
    businessCategory?: string
  }
  postsMapper: (data: any[], identifier: string) => {
    id: string
    url?: string
    type?: string
    content: string
    timestamp: string
    likes: number
    comments: number
    shares: number
    views?: number
    engagement: number
    mediaUrls: string[]
    thumbnailUrl?: string
    hashtags?: string[]
    mentions?: string[]
  }[]
  urlPattern: RegExp
  extractIdentifier: (input: string) => string
}

// ============================================
// APIFY OUTPUT MAPPERS
// ============================================

function youtubeProfileMapper(data: any, identifier: string) {
  const item = Array.isArray(data) ? data[0] : data
  return {
    username: item?.input?.username || item?.username || identifier,
    displayName: item?.title || item?.fullTitle,
    bio: item?.description,
    avatarUrl: item?.avatar || item?.thumbnailUrl,
    followers: item?.subscriberCount || item?.subscribers || 0,
    following: 0,
    posts: item?.videoCount || item?.videosCount || 0,
    engagement: item?.engagementRate || 0,
    growth: item?.growthRate || 0,
    trustScore: 50,
    verified: !!item?.verified,
  }
}

function youtubePostsMapper(data: any[], _identifier: string) {
  return (data || []).slice(0, 10).map((item: any, i: number) => ({
    id: item?.id || `yt-${i}`,
    content: item?.title || item?.text || '',
    timestamp: item?.publishedAt || item?.uploadDate || new Date().toISOString(),
    likes: item?.likes || item?.likeCount || 0,
    comments: item?.comments || item?.commentCount || 0,
    shares: item?.shares || 0,
    engagement: item?.engagementRate || 0,
    mediaUrls: [item?.thumbnailUrl || item?.thumbnails?.default?.url].filter(Boolean),
  }))
}

function instagramProfileMapper(data: any, identifier: string) {
  const item = Array.isArray(data) ? data[0] : data
  return {
    username: item?.username || item?.owner || identifier,
    displayName: item?.fullName || item?.name,
    bio: item?.biography || item?.description,
    avatarUrl: item?.profilePicUrl || item?.avatar,
    followers: item?.followersCount || item?.followers || 0,
    following: item?.followsCount || item?.following || 0,
    posts: item?.postsCount || item?.mediaCount || 0,
    engagement: item?.avgEngagement || item?.engagementRate || 0,
    growth: 0,
    trustScore: item?.isVerified ? 90 : 50,
    verified: !!item?.isVerified,
    externalWebsite: item?.externalUrl || item?.website,
    businessCategory: item?.businessCategoryName || item?.businessCategory,
  }
}

function instagramPostsMapper(data: any[], _identifier: string) {
  const item = Array.isArray(data) ? data[0] : data
  const rawPosts = Array.isArray(item?.latestPosts) ? item.latestPosts : []
  const igtv = Array.isArray(item?.latestIgtvVideos) ? item.latestIgtvVideos : []
  const allPosts = [...rawPosts, ...igtv]

  return allPosts.slice(0, 12).map((postItem: any, i: number) => ({
    id: postItem?.id || `ig-${i}`,
    url: postItem?.url || postItem?.postUrl,
    type: postItem?.type || postItem?.postType || postItem?.__typename,
    content: postItem?.caption || postItem?.text || '',
    timestamp: postItem?.timestamp || postItem?.createdAt || new Date().toISOString(),
    likes: postItem?.likesCount || postItem?.likes || 0,
    comments: postItem?.commentsCount || postItem?.comments || 0,
    shares: postItem?.sharesCount || 0,
    views: postItem?.videoViewCount || postItem?.viewCount || postItem?.playCount || 0,
    engagement: postItem?.engagementRate || 0,
    mediaUrls: [postItem?.displayUrl || postItem?.imageUrl || postItem?.url].filter(Boolean),
    thumbnailUrl: postItem?.thumbnailUrl || postItem?.displayUrl || postItem?.imageUrl,
    hashtags: postItem?.hashtags || [],
    mentions: postItem?.mentions || postItem?.taggedUsers?.map((u: any) => u.username) || [],
  }))
}

function xProfileMapper(data: any, identifier: string) {
  const item = Array.isArray(data) ? data[0] : data
  const user = item?.user || item || {}
  return {
    username: user?.screen_name || user?.username || identifier,
    displayName: user?.name || user?.displayName,
    bio: user?.description || user?.bio,
    avatarUrl: user?.profile_image_url_https || user?.avatar,
    followers: user?.followers_count || user?.followers || 0,
    following: user?.friends_count || user?.following || 0,
    posts: user?.statuses_count || user?.tweets || 0,
    engagement: user?.favourites_count > 0 ? (user.favourites_count / Math.max(1, user.followers_count || 1)) * 100 : 0,
    growth: 0,
    trustScore: user?.verified || user?.isVerified ? 85 : 45,
    verified: !!user?.verified || !!user?.isVerified,
  }
}

function xPostsMapper(data: any[], _identifier: string) {
  return (data || []).slice(0, 20).map((item: any, i: number) => ({
    id: item?.id || `x-${i}`,
    content: item?.text || item?.fullText || '',
    timestamp: item?.created_at || item?.createdAt || new Date().toISOString(),
    likes: item?.favorite_count || item?.likes || 0,
    comments: item?.reply_count || item?.replies || 0,
    shares: item?.retweet_count || item?.retweets || 0,
    engagement: item?.engagementRate || 0,
    mediaUrls: (item?.media || []).map((m: any) => m?.url || m?.media_url_https).filter(Boolean),
  }))
}

function telegramProfileMapper(data: any, identifier: string) {
  const item = Array.isArray(data) ? data[0] : data
  return {
    username: item?.username || item?.name || identifier,
    displayName: item?.title || item?.fullName,
    bio: item?.description,
    avatarUrl: item?.photoUrl || item?.avatar,
    followers: item?.subscriberCount || item?.members || 0,
    following: 0,
    posts: item?.messageCount || item?.posts || 0,
    engagement: item?.engagementRate || 0,
    growth: 0,
    trustScore: 50,
    verified: false,
  }
}

function telegramPostsMapper(data: any[], _identifier: string) {
  return (data || []).slice(0, 20).map((item: any, i: number) => ({
    id: item?.id || `tg-${i}`,
    content: item?.text || item?.message || '',
    timestamp: item?.date || item?.timestamp || new Date().toISOString(),
    likes: item?.views || item?.viewsCount || 0,
    comments: item?.commentsCount || 0,
    shares: item?.forwards || item?.shares || 0,
    engagement: item?.engagementRate || 0,
    mediaUrls: [item?.photoUrl || item?.imageUrl].filter(Boolean),
  }))
}

function facebookProfileMapper(data: any, identifier: string) {
  const item = Array.isArray(data) ? data[0] : data
  return {
    username: item?.pageName || item?.username || identifier,
    displayName: item?.name || item?.pageName,
    bio: item?.description || item?.about,
    avatarUrl: item?.profilePicUrl || item?.avatar,
    followers: item?.followerCount || item?.followers || 0,
    following: 0,
    posts: item?.postCount || item?.posts || 0,
    engagement: item?.avgEngagement || item?.engagementRate || 0,
    growth: 0,
    trustScore: item?.verified || item?.isVerified ? 80 : 45,
    verified: !!item?.verified || !!item?.isVerified,
  }
}

function facebookPostsMapper(data: any[], _identifier: string) {
  return (data || []).slice(0, 10).map((item: any, i: number) => ({
    id: item?.id || `fb-${i}`,
    content: item?.message || item?.text || item?.description || '',
    timestamp: item?.createdAt || item?.timestamp || new Date().toISOString(),
    likes: item?.likesCount || item?.likes || 0,
    comments: item?.commentsCount || item?.comments || 0,
    shares: item?.sharesCount || item?.shares || 0,
    engagement: item?.engagementRate || 0,
    mediaUrls: [item?.imageUrl || item?.thumbnailUrl].filter(Boolean),
  }))
}

// ============================================
// PLATFORM CONFIGURATIONS
// ============================================

export const APIFY_API_KEY_VAR = 'APIFY_API_KEY'

export function getApifyToken(): string {
  return process.env.APIFY_API_KEY || process.env.APIFY_TOKEN || ''
}

export function isApifyConfigured(): boolean {
  const token = getApifyToken()
  return token.length > 0
}

export const PLATFORM_CONFIGS: Record<SocialPlatform, ApifyActorConfig> = {
  instagram: {
    platform: 'instagram',
    // ROOT CAUSE FIXED: Actor `apify/instagram-profile-scraper` requires `directUrls` (not `usernames`)
    // The `usernames` field is ignored by the current actor version, causing 0 records.
    // `directUrls` with full profile URLs is the correct input format.
    actorId: 'apify~instagram-profile-scraper',
    displayName: 'Instagram',
    defaultLimit: 12,
    inputMapper: (identifier, limit) => {
      const cleanId = identifier.replace(/^@/, '').replace(/^https?:\/\//, '').replace(/instagram\.com\//, '').replace(/\/$/, '').split('?')[0].split('/')[0]
      return {
        directUrls: [`https://www.instagram.com/${cleanId}/`],
        resultsType: 'details',
        resultsLimit: limit || 12,
        addParentData: false,
      }
    },
    profileMapper: instagramProfileMapper,
    postsMapper: instagramPostsMapper,
    urlPattern: /instagram\.com/i,
    extractIdentifier: (input) => {
      const cleaned = input.replace(/^https?:\/\//, '').replace(/^@/, '')
      const match = cleaned.match(/(?:instagram\.com\/)?([\w._]+)/)
      return match ? match[1] : cleaned
    },
  },
  youtube: {
    platform: 'youtube',
    actorId: 'nFvXwAH2uvy4C6c22',
    displayName: 'YouTube',
    defaultLimit: 10,
    inputMapper: (identifier) => ({
      usernames: [identifier.replace(/^@/, '')],
      maxResults: 10,
    }),
    profileMapper: youtubeProfileMapper,
    postsMapper: youtubePostsMapper,
    urlPattern: /youtube\.com|youtu\.be/i,
    extractIdentifier: (input) => {
      const cleaned = input.replace(/^https?:\/\//, '')
      const channelMatch = cleaned.match(/channel\/([^\/\?&]+)/)
      if (channelMatch) return channelMatch[1]
      const handleMatch = cleaned.match(/\/(@?[\w-]+)/)
      if (handleMatch) return handleMatch[1]
      return cleaned
    },
  },
  x: {
    platform: 'x',
    // Uses apidojo/tweet-scraper (not the old apify/twitter-scraper)
    // This actor requires `urls` array with profile URLs (not `usernames`)
    actorId: 'apidojo~tweet-scraper',
    displayName: 'X (Twitter)',
    defaultLimit: 20,
    inputMapper: (identifier) => {
      const cleanId = identifier.replace(/^@/, '').replace(/^https?:\/\//, '').replace(/x\.com\/|twitter\.com\//, '').replace(/\/$/, '').split('?')[0].split('/')[0]
      return {
        urls: [`https://x.com/${cleanId}`],
        sort: 'Latest',
        maxItems: 20,
      }
    },
    profileMapper: xProfileMapper,
    postsMapper: xPostsMapper,
    urlPattern: /x\.com|twitter\.com/i,
    extractIdentifier: (input) => {
      const cleaned = input.replace(/^https?:\/\//, '')
      const match = cleaned.match(/(?:x\.com\/|twitter\.com\/)?(@?[\w_]+)/)
      return match ? match[1] : cleaned
    },
  },
  telegram: {
    platform: 'telegram',
    // Uses curious_coder/telegram-scraper which requires `channelUrls` or `channels`
    actorId: 'curious_coder~telegram-scraper',
    displayName: 'Telegram',
    defaultLimit: 20,
    inputMapper: (identifier) => {
      const cleaned = identifier.replace(/^https?:\/\//, '').replace(/^@/, '').replace(/\/$/, '')
      const channelName = cleaned.replace(/t\.me\//, '').replace(/telegram\.me\//, '')
      return {
        channelUrls: [`https://t.me/${channelName}`],
        limit: 20,
        maxItems: 20,
      }
    },
    profileMapper: telegramProfileMapper,
    postsMapper: telegramPostsMapper,
    urlPattern: /t\.me|telegram\.me/i,
    extractIdentifier: (input) => {
      const cleaned = input.replace(/^https?:\/\//, '')
      const match = cleaned.match(/(?:t\.me\/)?(@?[\w_]+)/)
      return match ? match[1] : cleaned
    },
  },
  facebook: {
    platform: 'facebook',
    // Facebook scraping via Apify is complex and often breaks.
    // Using a lightweight approach: fall back to AI-based estimation.
    // Actor ID intentionally blank - Facebook will use estimated data instead.
    actorId: '',
    displayName: 'Facebook',
    defaultLimit: 10,
    inputMapper: () => ({}),
    profileMapper: facebookProfileMapper,
    postsMapper: facebookPostsMapper,
    urlPattern: /facebook\.com|fb\.com/i,
    extractIdentifier: (input) => {
      const cleaned = input.replace(/^https?:\/\//, '')
      const match = cleaned.match(/(?:facebook\.com\/)?([\w.]+)/)
      return match ? match[1] : cleaned
    },
  },
  linkedin: {
    platform: 'linkedin',
    actorId: '',
    displayName: 'LinkedIn',
    defaultLimit: 10,
    inputMapper: () => ({}),
    profileMapper: (_data: any, identifier: string) => ({
      username: identifier,
      displayName: identifier,
      followers: 0,
      following: 0,
      posts: 0,
      engagement: 0,
      growth: 0,
      trustScore: 50,
      verified: false,
    }),
    postsMapper: () => [],
    urlPattern: /linkedin\.com/i,
    extractIdentifier: (input) => {
      const cleaned = input.replace(/^https?:\/\//, '')
      const match = cleaned.match(/(?:linkedin\.com\/in\/)?([\w-]+)/)
      return match ? match[1] : cleaned
    },
  },
}

export function getPlatformConfig(platform: SocialPlatform): ApifyActorConfig {
  return PLATFORM_CONFIGS[platform]
}

export function getActiveSocialPlatforms(): SocialPlatform[] {
  return ['instagram', 'youtube', 'x', 'telegram', 'facebook']
}