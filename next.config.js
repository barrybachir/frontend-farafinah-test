/** @type {import('next').NextConfig} */
const nextConfig = {
  // lowdb est un module ESM pur — Next.js doit le transpiler
  transpilePackages: ['lowdb'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

module.exports = nextConfig
