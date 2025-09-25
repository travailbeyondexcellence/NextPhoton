/** @type {import('next').NextConfig} */

import { hostname } from "os";

console.log("✅ Next.js config loaded. App starting on default port ");

const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "images.pexels.com",
        hostname: "images.unsplash.com",
        hostname: "cdn.pixabay.com",
        hostname: "www.gravatar.com",
      },
    ],
  },
};

export default nextConfig;
