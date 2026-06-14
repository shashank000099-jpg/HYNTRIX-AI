import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

const CREDIT_COSTS: Record<string, number> = {
  // All features — 20 credits each
  'startup-judge': 20,
  'startup-roast': 20,
  'death-scanner': 20,
  'success-predictor': 20,
  'competitor-scanner': 20,
  'startup-valuator': 20,
  'business-model-analyzer': 20,
  'moat-analyzer': 20,
  'founder-dna': 20,
  'founder-score': 20,
  'founder-weakness-scanner': 20,
  'leadership-analyzer': 20,
  'founder-readiness': 20,
  'founder-gps': 20,
  'founder-roadmap': 20,
  'opportunity-finder': 20,
  'market-gap-scanner': 20,
  'trend-detector': 20,
  'niche-discovery': 20,
  'opportunity-radar': 20,
  'side-hustle-finder': 20,
  'income-roadmap': 20,
  'instagram-analyzer': 20,
  'youtube-analyzer': 20,
  'linkedin-analyzer': 20,
  'telegram-analyzer': 20,
  'x-analyzer': 20,
  'instagram-judge': 20,
  'youtube-judge': 20,
  'linkedin-judge': 20,
  'telegram-judge': 20,
  'x-judge': 20,
  'product-advisor': 20,
  'growth-advisor': 20,
  'finance-advisor': 20,
  'legal-advisor': 20,
  'ai-client-finder': 20,
}

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ success: false, error: 'Supabase not configured' }, { status: 500 })
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.headers.get('cookie')?.split(';').map(c => {
          const [name, value] = c.trim().split('=')
          return { name, value }
        }) || []
      },
      setAll() {},
    },
  })

  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
  }

  const userId = session.user.id
  const { feature, reportId } = await request.json()

  if (!feature || !CREDIT_COSTS[feature]) {
    return NextResponse.json({ success: false, error: 'Invalid feature' }, { status: 400 })
  }

  const cost = CREDIT_COSTS[feature]

  // Get current wallet
  const { data: wallet } = await supabase
    .from('credits')
    .select('remaining, used')
    .eq('user_id', userId)
    .maybeSingle()

  const currentRemaining = wallet?.remaining ?? 0
  const currentUsed = wallet?.used ?? 0
  const currentTotal = currentRemaining + currentUsed

  if (currentRemaining < cost) {
    return NextResponse.json({
      success: false,
      error: `Insufficient credits. You need ${cost} credits but only have ${currentRemaining}.`,
      currentCredits: currentRemaining,
      requiredCredits: cost,
    }, { status: 402 })
  }

  // Deduct credits server-side
  const newRemaining = currentRemaining - cost
  const newUsed = currentUsed + cost

  const { error: updateError } = await supabase
    .from('credits')
    .update({
      remaining: newRemaining,
      used: newUsed,
    })
    .eq('user_id', userId)

  if (updateError) {
    return NextResponse.json({ success: false, error: `Failed to deduct: ${updateError.message}` }, { status: 500 })
  }

  // Create transaction record
  const { error: txError } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      transaction_type: 'usage',
      credits: cost,
      balance_before: currentRemaining,
      balance_after: newRemaining,
      description: `Used ${cost} credits for ${feature}`,
      reference_type: 'feature',
      reference_id: feature,
    })

  if (txError) {
    console.error('Transaction record error:', txError)
  }

  return NextResponse.json({
    success: true,
    remainingCredits: newRemaining,
    creditsUsed: cost,
    feature,
  })
}