import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // 管理员路由保护
    if (path.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // 团队成员路由保护
    if (path.startsWith("/team") && !["admin", "team"].includes(token?.role as string)) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // 用户路由保护
    if (path.startsWith("/dashboard") && !token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

// 配置需要保护的路由
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/team/:path*", "/profile/:path*"]
} 