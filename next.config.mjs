import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'twitter-likith.s3.ap-south-1.amazonaws.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'd9p54qqd9sgmh.cloudfront.net',
        pathname: '/uploads/**'
      }

    ],
    domains: [
      'd9p54qqd9sgmh.cloudfront.net',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
      'twitter-bucket-likith.s3.ap-south-1.amazonaws.com',
    ],
  },
  output: 'standalone',
};

export default withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })(nextConfig);
