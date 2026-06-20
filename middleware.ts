import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedRoutes = ["/favorites", "/profile", "/playlists"];
const publicOnlyRoutes = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is protected or public-only
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isPublicOnlyRoute = publicOnlyRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Get session from cookie (set by Supabase Auth)
  const authCookie = request.cookies.get("sb-auth-token")?.value;
  const hasSession = !!authCookie;

  // Redirect unauthenticated users trying to access protected routes
  if (isProtectedRoute && !hasSession) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users trying to access login
  if (isPublicOnlyRoute && hasSession) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
