import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  async rewrites() {
    return [
      {
        source: '/proxy/cimahi/:path*',
        destination: 'https://smartcity.cimahikota.go.id/video/:path*',
      },
      {
        source: '/proxy/bandung/:path*',
        destination: 'https://pelindung.bandung.go.id:3443/video/:path*',
      },
      {
        source: '/proxy/kbb/:path*',
        destination: 'https://cctv.atcs-dishubkbb.id/:path*',
      },
      {
        source: '/proxy/bandungkab/:path*',
        destination: 'https://cctv.bandungkab.go.id/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};

export default nextConfig;
