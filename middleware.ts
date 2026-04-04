import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Protect /admin routes — admin role only
    if (pathname.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Allow request to reach middleware function only if user is authenticated
      authorized: ({ token }) => !!token,
    },
  }
);

// Apply middleware to protected routes only
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
