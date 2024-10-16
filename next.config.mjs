import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: ,
        pathname: '/uploads/**',
      },
    ],
    domains: [
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
      'twitter-clone-likith.s3.ap-south-1.amazonaws.com',
    ],
  },
};

export default withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })(nextConfig);
