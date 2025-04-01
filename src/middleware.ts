import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  
  // Check if the request is for the dashboard or its subpages
  if (pathname.startsWith('/dashboard')) {
    const token = req.cookies.get('auth_token')?.value;

    // Verify token longevity (example: check expiration)
    if (!token || isTokenExpired(token)) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    function isTokenExpired(token: string): boolean {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
      } catch {
        return true; // Treat as expired if parsing fails
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
};