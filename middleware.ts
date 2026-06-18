import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

const publicRoutes = ['/', '/auth/login', '/auth/signup', '/auth/forgot-password', '/auth/callback', '/auth/verify']
const publicPrefixes = ['/api/razorpay']
const authOnlyRoutes = ['/auth/login', '/auth/signup']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

  if (!supabaseUrl || !supabaseAnonKey) {
    return res
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
        cookiesToSet.forEach(({ name, value, options }) =>
          res.cookies.set(name, value, options)
        )
      },
    },
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl

  // If user is authenticated, redirect away from login/signup pages
  if (session && authOnlyRoutes.includes(pathname)) {
    // Check if user has completed onboarding
    const { data: profile } = await supabase
      .from('users')
      .select('onboarding_completed')
      .eq('id', session.user.id)
      .maybeSingle()

    if (profile?.onboarding_completed) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return NextResponse.redirect(new URL('/onboarding', req.url))
  }

  // Allow public routes and public prefixes
  if (publicRoutes.includes(pathname) || publicPrefixes.some(prefix => pathname.startsWith(prefix))) {
    return res
  }

  // Redirect to login if not authenticated
  if (!session) {
    const signInUrl = new URL('/auth/login', req.url)
    signInUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Admin check
  if (pathname.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', session.user.id)
      .maybeSingle()

    if (!profile?.is_admin) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return res
}