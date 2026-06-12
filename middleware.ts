import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: ['/', '/admin/:path*', '/dashboard', '/dashboard/:path*', '/board-room/:path*', '/founder-hub', '/founder-hub/:path*', '/founder-intelligence', '/founder-intelligence/:path*', '/opportunity-hub', '/opportunity-hub/:path*', '/social-intelligence', '/social-intelligence/:path*', '/simulators', '/simulators/:path*', '/history', '/saved-reports', '/profile', '/profile/:path*', '/settings']
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase middleware disabled because NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing');
    return res;
  }

  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session }
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;
  const publicRoutes = ['/auth/login', '/auth/signup', '/auth/forgot-password', '/'];

  if (publicRoutes.includes(pathname)) {
    return res;
  }

  if (!session) {
    const signInUrl = new URL('/auth/login', req.url);
    signInUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (pathname.startsWith('/admin')) {
    const isAdmin = session.user?.app_metadata?.role === 'admin' || session.user?.user_metadata?.role === 'admin';
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return res;
}
