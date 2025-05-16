/** @type {import('next').NextConfig} */



console.log("✅ Next.js config loaded. App starting on default port ");

const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "images.pexels.com" }],
    domains: ['www.gravatar.com'],
  },
};

export default nextConfig;
