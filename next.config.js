/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  experimental: {
    optimizeCss: true,
  },
  // Disable static generation for error pages to prevent build issues
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
}

module.exports = nextConfig
