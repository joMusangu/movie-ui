import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define paths that require authentication


// Define paths that require admin access
const adminPaths = ["/admin"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the user is authenticated by looking for the auth cookie
  const authCookie = request.cookies.get("auth")
  const isAuthenticated = !!authCookie

  // Check if the user is an admin (you might need to decode the JWT or check a specific cookie)
  // For this example, we'll assume there's an admin cookie or a claim in the JWT
  const adminCookie = request.cookies.get("is_admin")
  const isAdmin = adminCookie?.value === "true"

  // Redirect unauthenticated users trying to access protected routes
 

  // Redirect non-admin users trying to access admin routes
  if (adminPaths.some((path) => pathname.startsWith(path)) && (!isAuthenticated || !isAdmin)) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Allow the request to continue
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public folder
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
}
