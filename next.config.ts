import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  // Meticulous needs browser source maps to connect replayed JavaScript to source lines.
  productionBrowserSourceMaps: process.env.METICULOUS_BUILD === 'true',
}

export default withNextIntl(nextConfig)
