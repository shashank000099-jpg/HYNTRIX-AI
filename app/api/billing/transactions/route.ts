import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

function createClient(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase not configured')
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
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
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    const type = url.searchParams.get('type')
    const limit = parseInt(url.searchParams.get('limit') || '50')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const supabase = createClient(request)

    const result: Record<string, any> = {}

    if (!type || type === 'transactions' || type === 'both') {
      const { data: transactions, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (!txError) {
        result.transactions = transactions
      } else {
        result.transactions = []
      }
    }

    if (!type || type === 'credit-history' || type === 'both') {
      const { data: creditHistory, error: chError } = await supabase
        .from('credit_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (!chError) {
        result.creditHistory = creditHistory
      } else {
        result.creditHistory = []
      }
    }

    const { data: wallet } = await supabase
      .from('credits')
      .select('remaining, used')
      .eq('user_id', userId)
      .maybeSingle()

    result.balance = {
      remaining: wallet?.remaining ?? 0,
      used: wallet?.used ?? 0,
      total: (wallet?.remaining ?? 0) + (wallet?.used ?? 0),
    }

    return NextResponse.json({ success: true, ...result })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch billing data'
    console.error('[Billing API] Error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}