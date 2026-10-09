import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'ecocycle.local' },
    ],
  },
  transpilePackages: ['@ecocycle/shared'],
};

export default nextConfig;
