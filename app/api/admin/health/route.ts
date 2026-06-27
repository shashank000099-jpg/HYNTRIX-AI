// ============================================
// ADMIN HEALTH CHECK API
// ============================================
// Returns integration status without exposing secret values.
// Only accessible by authenticated admin users.

import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

interface ServiceStatus {
  name: string
  key: string
  configured: boolean
  status: 'ok' | 'missing' | 'error'
  message: string
  category: 'database' | 'ai' | 'payment' | 'social'
}

function checkEnvVar(name: string): boolean {
  const val = process.env[name]
  return !!val && val.trim().length > 0 && !val.includes('your-') && !val.includes('placeholder')
}

export async function GET(request: Request) {
  try {
    // Verify admin authentication
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ success: false, error: 'Supabase not configured' }, { status: 500 })
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() { return request.headers.get('cookie')?.split(';').map(c => { const [n, v] = c.trim().split('='); return { name: n, value: v } }) || [] },
        setAll() {},
      },
    })

    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    // Check admin status
    const { data: profile } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', session.user.id)
      .maybeSingle()

    if (!profile?.is_admin) {
      return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 })
    }

    // Build service status array
    const services: ServiceStatus[] = [
      {
        name: 'Supabase',
        key: 'supabase',
        configured: checkEnvVar('NEXT_PUBLIC_SUPABASE_URL') && checkEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
        status: checkEnvVar('NEXT_PUBLIC_SUPABASE_URL') ? 'ok' : 'missing',
        message: checkEnvVar('NEXT_PUBLIC_SUPABASE_URL') ? 'Database and auth configured' : 'Missing Supabase URL or Anon Key',
        category: 'database',
      },
      {
        name: 'Gemini AI',
        key: 'gemini',
        configured: checkEnvVar('GEMINI_API_KEY'),
        status: checkEnvVar('GEMINI_API_KEY') ? 'ok' : 'missing',
        message: checkEnvVar('GEMINI_API_KEY') ? 'AI provider configured' : 'Missing GEMINI_API_KEY',
        category: 'ai',
      },
      {
        name: 'OpenAI',
        key: 'openai',
        configured: checkEnvVar('OPENAI_API_KEY'),
        status: checkEnvVar('OPENAI_API_KEY') ? 'ok' : 'missing',
        message: checkEnvVar('OPENAI_API_KEY') ? 'Optional AI provider configured' : 'Not configured (optional)',
        category: 'ai',
      },
      {
        name: 'Razorpay',
        key: 'razorpay',
        configured: checkEnvVar('NEXT_PUBLIC_RAZORPAY_KEY_ID') && checkEnvVar('RAZORPAY_KEY_SECRET'),
        status: checkEnvVar('NEXT_PUBLIC_RAZORPAY_KEY_ID') ? 'ok' : 'missing',
        message: checkEnvVar('NEXT_PUBLIC_RAZORPAY_KEY_ID') ? 'Payment provider configured' : 'Missing Razorpay credentials',
        category: 'payment',
      },
      {
        name: 'YouTube Data API',
        key: 'youtube',
        configured: checkEnvVar('YOUTUBE_API_KEY'),
        status: checkEnvVar('YOUTUBE_API_KEY') ? 'ok' : 'missing',
        message: checkEnvVar('YOUTUBE_API_KEY') ? 'Social data provider configured' : 'Not configured (optional)',
        category: 'social',
      },
      {
        name: 'Apify',
        key: 'apify',
        configured: checkEnvVar('APIFY_API_KEY'),
        status: checkEnvVar('APIFY_API_KEY') ? 'ok' : 'missing',
        message: checkEnvVar('APIFY_API_KEY') ? 'Social scraping configured' : 'Not configured (optional)',
        category: 'social',
      },
    ]

    // Try to verify Supabase connectivity
    if (services[0].configured) {
      try {
        const { error: pingError } = await supabase.from('users').select('id').limit(1)
        if (pingError) {
          services[0].status = 'error'
          services[0].message = `Supabase connection issue: ${pingError.message}`
        }
      } catch (e: any) {
        services[0].status = 'error'
        services[0].message = `Supabase connection error: ${e.message}`
      }
    }

    // Generate system info
    const systemInfo = {
      nodeEnv: process.env.NODE_ENV || 'development',
      nextVersion: '16.2.6',
      platform: process.platform,
      runtime: 'Node.js ' + process.version,
      adminEmail: session.user.email,
      adminId: session.user.id,
      configuredCount: services.filter(s => s.configured).length,
      totalCount: services.length,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      services,
      system: systemInfo,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Health check failed'
    console.error('[AdminHealth] Error:', message)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
