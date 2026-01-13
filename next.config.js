/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['dune.com'],
        formats: ['image/avif', 'image/webp'],
    },
    experimental: {
        optimizePackageImports: ['lucide-react'],
    },
}

module.exports = nextConfig