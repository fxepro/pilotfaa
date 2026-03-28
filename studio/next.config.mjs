/** @type {import('next').NextConfig} */
const nextConfig = {
  // eslint config moved to separate .eslintrc.json in Next.js 16
  typescript: {
    ignoreBuildErrors: false, // Enable TypeScript error checking during builds
  },
  // Use webpack instead of Turbopack due to CSS parsing issues with custom syntax
  turbopack: {},
  images: {
    unoptimized: true,
  },
  async rewrites() {
    // Only use rewrites in development - nginx handles routing in production
    if (process.env.NODE_ENV === 'production') {
      return [];
    }
    return [
      {
        source: '/api/sitemap',
        destination: 'http://localhost:8000/api/sitemap/',
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
      // Note: Django admin should be accessed directly at http://localhost:8000/django-admin/
      // to avoid redirect loops. Next.js rewrites don't handle Django's APPEND_SLASH redirects well.
    ];
  },
}

export default nextConfig
