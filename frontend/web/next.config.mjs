/** @type {import('next').NextConfig} */

import { hostname } from "os";

console.log("✅ Next.js config loaded. App starting on default port ");

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "images.pexels.com",
      },
      {
        protocol: 'https',
        hostname: "images.unsplash.com",
      },
      {
        protocol: 'https',
        hostname: "cdn.pixabay.com",
      },
      {
        protocol: 'https',
        hostname: "www.gravatar.com",
      },
      {
        protocol: 'https',
        hostname: "pbs.twimg.com",
      },
      {
        protocol: 'https',
        hostname: "*.twimg.com",
      },
      {
        protocol: 'https',
        hostname: "educators.com",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Exclude server-only modules from client bundle
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        // Mark these modules as external for client-side builds
        'fs': false,
        'path': false,
        'uuid': false,
      };
    }
    return config;
  },
};

export default nextConfig;
