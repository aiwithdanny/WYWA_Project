/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'wywa-backend.onrender.com',
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
}

module.exports = nextConfig
