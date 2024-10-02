import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
    },
};

export default withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })(nextConfig);
