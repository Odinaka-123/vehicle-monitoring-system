import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const sessionCookie = req.cookies.get("session");

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const session = JSON.parse(sessionCookie.value);

  const path = req.nextUrl.pathname;

  if (path.startsWith("/admin") && session.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/incidents/:path*"],
};
