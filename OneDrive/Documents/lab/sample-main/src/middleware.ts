import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isEdgeAdminAuthenticated } from "@/lib/auth-edge";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieHeader = request.headers.get("cookie");
  const isAuth = isEdgeAdminAuthenticated(cookieHeader);

  // 1. Admin Page Protection
  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";

    // If already logged in and visiting login page, redirect to dashboard
    if (isLoginPage && isAuth) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // If not logged in and visiting any admin page other than login, redirect to login
    if (!isLoginPage && !isAuth) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // 2. Admin API Protection (defense against unauthorized API mutations & data access)
  const isProtectedApi =
    // Upload API (ebooks, QR codes, images)
    pathname === "/api/admin/upload" ||
    // Orders management (excluding public customer lookup)
    (pathname.startsWith("/api/orders") && pathname !== "/api/orders/lookup") ||
    // Settings modification (GET is public for storefront; POST is admin-only)
    (pathname === "/api/settings" && request.method !== "GET") ||
    // Product creation/editing/deletion (GET is public; POST/PUT/DELETE are admin-only)
    (pathname.startsWith("/api/products") && request.method !== "GET");

  if (isProtectedApi && !isAuth) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized: Admin authentication required to access this endpoint.",
      },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/upload",
    "/api/orders/:path*",
    "/api/orders",
    "/api/settings",
    "/api/products/:path*",
    "/api/products",
  ],
};
