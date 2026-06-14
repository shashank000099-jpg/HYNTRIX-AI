import { createClient } from '../../../lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const type = searchParams.get('type')
  const token_hash = searchParams.get('token_hash')

  // Handle OAuth callback (Google, etc.)
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Auth callback error:', error.message)
      return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`)
    }

    // Get the user from the session
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // Check if user profile exists
      const { data: existingProfile } = await supabase
        .from('users')
        .select('id, name, goal')
        .eq('id', user.id)
        .maybeSingle()

      if (!existingProfile) {
        // Create new user profile from OAuth data
        const name = user.user_metadata?.full_name || 
                     user.user_metadata?.name || 
                     user.email?.split('@')[0] || 'User'
        
        // Use upsert to prevent duplicate key errors
        const { error: profileError } = await supabase
          .from('users')
          .upsert({
            id: user.id,
            email: user.email!,
            name,
            avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
            plan: 'free',
            credits: 0,
            xp: 0,
            level: 1,
            is_admin: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' })

        if (profileError) {
          console.error('Profile creation error:', profileError)
        }

        // Create credits record (0 credits, no free credits)
        await supabase
          .from('credits')
          .upsert({
            user_id: user.id,
            amount: 0,
            remaining: 0,
            used: 0,
            plan_name: 'free'
          }, { onConflict: 'user_id' })

        // Create settings record
        await supabase
          .from('settings')
          .upsert({
            user_id: user.id,
            language: 'en',
            theme: 'dark',
            notifications_enabled: true
          }, { onConflict: 'user_id' })

        // Create streak record
        await supabase
          .from('streaks')
          .upsert({
            user_id: user.id,
            streak_days: 1,
            last_active_at: new Date().toISOString()
          }, { onConflict: 'user_id' })

        // New user: redirect to onboarding
        return NextResponse.redirect(`${origin}/onboarding`)
      }

      // Existing user: check if onboarding is done
      const hasOnboarded = existingProfile.name && existingProfile.name.length > 0 && existingProfile.goal
      if (hasOnboarded) {
        return NextResponse.redirect(`${origin}/`)
      }

      // Existing user with incomplete onboarding
      return NextResponse.redirect(`${origin}/onboarding`)
    }

    return NextResponse.redirect(`${origin}/auth/login?error=no_user`)
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