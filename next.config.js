/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.56.1'],
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        '192.168.56.1:3000',
        process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, '') ?? '',
      ].filter(Boolean),
    },
  },
}

export default nextConfig
