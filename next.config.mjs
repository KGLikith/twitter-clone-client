import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
<<<<<<< HEAD
        hostname: 'twitter-bucket-likith.s3.ap-south-1.amazonaws.com',
=======
        hostname: ,
>>>>>>> d00cc13022747cbaa9b5a869240f28fdad38dc7b
        pathname: '/uploads/**',
      },
    ],
    domains: [
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
<<<<<<< HEAD
      'twitter-bucket-likith.s3.ap-south-1.amazonaws.com',
=======
      ' ',
>>>>>>> d00cc13022747cbaa9b5a869240f28fdad38dc7b
    ],
  },
};

export default withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })(nextConfig);
