import { NextResponse } from "next/server";

export function proxy(request) {
  const token = request.cookies.get("auth-token");
  const { pathname } = request.nextUrl;

  // Protected admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
