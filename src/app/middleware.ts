// middleware.ts
import { useCurrentUser } from '@/hooks/user';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/user'];

export  function middleware(request: NextRequest) {
    const {data }= useCurrentUser();
    const user=data?.getCurrentUser
  const { pathname } = request.nextUrl;
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && (!user || !user?.id)) {
    const loginUrl = new URL('/not_authorised', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/user/:path*'],
};
