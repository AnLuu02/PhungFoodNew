const withBundleAnalyzer = (await import('@next/bundle-analyzer')).default({
  enabled: process.env.ANALYZE === 'true'
});

await import('./src/env.js');

/** @type {import("next").NextConfig} */
const config = {
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks']
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.vnecdn.net',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'foodish-api.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**'
      }
    ]
  }
};

export default withBundleAnalyzer(config);
