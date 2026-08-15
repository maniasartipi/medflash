import type { NextConfig } from "next";

const nextConfig: import('next').NextConfig = {
  output: 'export',
  basePath: '/medflash',
  images: {
    unoptimized: true,
  },
  // Allow cross-origin requests for local IDE preview environments
  allowedDevOrigins: ['127.0.0.1', 'localhost']
};

export default nextConfig;
