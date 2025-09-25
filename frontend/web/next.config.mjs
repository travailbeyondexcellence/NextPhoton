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
    ],
  },
};

export default nextConfig;
