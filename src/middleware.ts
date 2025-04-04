import { NextRequest, NextResponse } from "next/server";
import { getLinkToRedirect } from "./server/actions/link";

export async function middleware(request: NextRequest) {

  const { nextUrl } = request

  const pathname = nextUrl.pathname.split('/')[1];

  if (pathname === '') {
    return NextResponse.next()
  }

  const linkToRedirect = await getLinkToRedirect(pathname)

  if (linkToRedirect.error) {
    return NextResponse.json(
      {
        error: true,
        message: linkToRedirect.message,
      },
      {
        status: 404
      })
  }

  if (linkToRedirect.url) {
    return NextResponse.redirect(new URL(linkToRedirect.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}