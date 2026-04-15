import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("session-token")?.value;
  const url = request.nextUrl.clone();

  // Redirect to login if unauthenticated for protected routes
  const isProtected = url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/admin");
  if (isProtected && !token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (token) {
    try {
      // Decode JWT without crypto verification (Mock environment only)
      const decodedPayload = Buffer.from(token, "base64").toString("utf-8");
      const session = JSON.parse(decodedPayload);
      const isAdmin = session.role === "ADMIN";

      // Redirect Admins away from /dashboard to /admin
      if (url.pathname.startsWith("/dashboard") && isAdmin) {
        url.pathname = "/admin";
        return NextResponse.redirect(url);
      }

      // Redirect Non-Admins away from /admin to /dashboard
      if (url.pathname.startsWith("/admin") && !isAdmin) {
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }

      // If at login page and authenticated, send to appropriate portal
      if (url.pathname === "/login") {
        url.pathname = isAdmin ? "/admin" : "/dashboard";
        return NextResponse.redirect(url);
      }
    } catch {
      // If token is malformed, force a real login redirect
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login"],
};
