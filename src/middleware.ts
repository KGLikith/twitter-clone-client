import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const publicRoutes = ["/"];
const authRoutes = ["/auth", "/api/auth"];

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const origin = req.headers.get("origin") ?? "";
  const pathname = req.nextUrl.pathname;

  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  if (publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))
  ) {
    return NextResponse.next();
  }

  const isAuthorized = !!req.auth;

  if(isAuthorized && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if(authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (!isAuthorized) {
    const signInUrl = new URL("/auth/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|api/auth|user.png|.*\\.(?:js|css|jpg|jpeg|png|svg|gif|ico|woff2?|ttf|webmanifest)$).*)"
  ],
};

