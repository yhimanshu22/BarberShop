import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isShopPath = req.nextUrl.pathname.startsWith("/shop")
    
    if (isShopPath && token?.role !== "SHOP_OWNER") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: ["/shop/:path*"]
} 