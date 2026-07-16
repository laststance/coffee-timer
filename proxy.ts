import { type NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

/** Route paths (without locale prefix) that require authentication. */
const protectedPaths = ['/mypage']

/**
 * Check if a pathname (after stripping locale prefix) matches a protected route.
 *
 * @param pathname - Full request pathname e.g. "/en/mypage"
 * @returns true if the route requires auth
 *
 * @example
 * isProtectedRoute('/en/mypage') // => true
 * isProtectedRoute('/ja/')       // => false
 */
function isProtectedRoute(pathname: string): boolean {
  const withoutLocale = pathname.replace(/^\/(en|ja)/, '') || '/'
  return protectedPaths.some((p) => withoutLocale.startsWith(p))
}

/**
 * Next.js 16 proxy (middleware) combining auth protection with i18n routing.
 * - Protected routes redirect to sign-in if no session cookie present.
 * - All non-API routes pass through next-intl middleware.
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Lightweight cookie check for protected routes (no DB call)
  if (isProtectedRoute(pathname)) {
    const sessionCookie =
      request.cookies.get('better-auth.session_token') ??
      request.cookies.get('__Secure-better-auth.session_token')
    if (!sessionCookie) {
      const locale = pathname.match(/^\/(en|ja)/)?.[1] ?? 'en'
      return NextResponse.redirect(new URL(`/${locale}/sign-in`, request.url))
    }
  }

  return intlMiddleware(request)
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/shortcuts`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|shortcuts|_next|_vercel|.*\\..*).*)'],
}
