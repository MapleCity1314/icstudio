import type { NextConfig } from "next";
import createMDX from '@next/mdx'

const nextConfig: NextConfig = {
  /* config options here */
  //dynamicIO: true, // 启用动态IO

  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'], // 添加MDX支持

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

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  // extension: /\.(md|mdx)$/,
  
})
 
// Merge MDX config with Next.js config
export default withMDX(nextConfig)

// export default nextConfig; 
