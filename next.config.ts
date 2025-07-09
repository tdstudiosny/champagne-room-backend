import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Only use export for production builds
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    trailingSlash: true,
  }),
  images: {
    unoptimized: true
  },
  async rewrites() {
    return process.env.NODE_ENV === 'development' ? [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5001/api/:path*',
      },
    ] : []
  },
}

export default nextConfig
