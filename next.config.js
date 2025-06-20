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
    domains: ['aoetaifwgjb4klqx.public.blob.vercel-storage.com']
  }
};

export default config;
