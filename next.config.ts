import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Local API wrappers must run before proxying to backend
      {
        source: '/api/google-places/:path*',
        destination: '/api/google-places/:path*',
      },
      {
        source: '/api/images/proxy/:path*',
        destination: '/api/images/proxy/:path*',
      },
      // Proxy other API calls to backend
      // BACKEND_URL ya incluye /api (ej: https://api.tiyuy.com/api)
      // por lo tanto destination = BACKEND_URL/:path*
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_URL ? process.env.BACKEND_URL.replace(/\/+$/, '') : 'http://152.70.129.43:8080/api'}/:path*`,
      },
      // Existing rewrites
      {
        source: '/dashboard/mensajes',
        destination: '/dashboard/mis-contactos',
      },
      {
        source: '/dashboard/clientes',
        destination: '/dashboard/mis-contactos',
      },
      {
        source: '/dashboard/mis-propiedades',
        destination: '/mis-propiedades',
      },
      {
        source: '/dashboard/planes',
        destination: '/planes',
      },
          ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wasyn-properties-images.s3.us-east-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wasyn-properties.s3.us-east-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
  },
};

export default nextConfig;