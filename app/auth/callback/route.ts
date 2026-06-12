import { createClient } from '../../../lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const type = searchParams.get('type')
  const token_hash = searchParams.get('token_hash')

  // Handle OAuth callback
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
    return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`)
  }

  // Handle email verification (from magic link or email OTP)
  if (type && token_hash) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({
      type: type as 'signup' | 'email' | 'recovery',
      token_hash,
    })

    if (!error) {
      return NextResponse.redirect(`${origin}/auth/verify?verified=true`)
    }

    if (error.message?.includes('expired')) {
      return NextResponse.redirect(`${origin}/auth/verify?error=expired`)
    }

    return NextResponse.redirect(`${origin}/auth/verify?error=invalid`)
  }

  // Default: redirect to login
  return NextResponse.redirect(`${origin}/auth/login`)
}