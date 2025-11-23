import { NextResponse } from 'next/server'

const SUPPORTED_LOCALES = ['en', 'te', 'hi', 'ta']
const SKIP_PATH_PREFIXES = ['/_next', '/static', '/favicon.ico', '/robots.txt', '/api']

function detectLocaleFromHeader(acceptLang) {
  if (!acceptLang) return null
  const lower = acceptLang.toLowerCase()
  if (lower.includes('hi')) return 'hi'
  if (lower.includes('ta')) return 'ta'
  if (lower.includes('te')) return 'te'
  if (lower.includes('en')) return 'en'
  return null
}

export function middleware(request) {
  const url = request.nextUrl.clone()
  const { pathname, search } = url

  // Skip internal Next.js and API routes
  if (SKIP_PATH_PREFIXES.some(p => pathname.startsWith(p))) return NextResponse.next()

  // Extract first path segment
  const firstSeg = pathname.split('/').filter(Boolean)[0]

  // If already localized (starts with supported locale), proceed
  if (firstSeg && SUPPORTED_LOCALES.includes(firstSeg)) return NextResponse.next()

  // Determine locale: cookie 'i18next' preferred, then Accept-Language header, else 'en'
  const cookieLocale = request.cookies.get('i18next')?.value
  const headerLocale = detectLocaleFromHeader(request.headers.get('accept-language'))
  const locale = cookieLocale || headerLocale || 'en'

  // Build redirect URL, preserving path and query
  const redirectPath = `/${locale}${pathname}${search || ''}`

  return NextResponse.redirect(new URL(redirectPath, request.url))
}

export const config = {
  // Run middleware on all paths (except static/_next handled above)
  matcher: '/:path*',
}
