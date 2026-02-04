import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session
  const session = await auth();

  // Define route types
  const isAuthRoute = pathname === '/sign-in' || pathname === '/sign-up';
  const isProtectedRoute = 
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/expenses') ||
    pathname.startsWith('/categories') ||
    pathname.startsWith('/budgets');

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect non-authenticated users to login
  if (isProtectedRoute && !session) {
    const loginUrl = new URL('/sign-in', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};