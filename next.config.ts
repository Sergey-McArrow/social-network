import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '3mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/a/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/tailgramm/**',
      },
    ],
  },
  trailingSlash: true,
}

export default withNextIntl(nextConfig)
