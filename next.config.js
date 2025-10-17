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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aoetaifwgjb4klqx.public.blob.vercel-storage.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'vcdn1-dulich.vnecdn.net',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'i1-ngoisao.vnecdn.net',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'i1-dulich.vnecdn.net',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'vcdn1-ngoisao.vnecdn.net',
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
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**'
      }
    ]
  }
};

export default withBundleAnalyzer(config);
