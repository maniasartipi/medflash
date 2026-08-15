import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  additionalPrecacheEntries: [{ url: "/medflash/", revision: crypto.randomUUID() }],
});

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/medflash',
  images: {
    unoptimized: true,
  },
  // Allow cross-origin requests for local IDE preview environments
  allowedDevOrigins: ['127.0.0.1', 'localhost']
};

export default withSerwist(nextConfig);
