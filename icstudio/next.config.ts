import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  //dynamicIO: true, // 启用动态IO
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  }
};

export default nextConfig; 
