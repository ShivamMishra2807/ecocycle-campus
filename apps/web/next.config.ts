import type { NextConfig } from 'next';

const isGithubPages = process.env.GITHUB_PAGES === 'true' || process.env.EXPORT === 'true';

const nextConfig: NextConfig = {
  output: isGithubPages ? 'export' : undefined,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'ecocycle.local' },
    ],
  },
  transpilePackages: ['@ecocycle/shared'],
};

export default nextConfig;
