/** @type {import('next').NextConfig} */



console.log("✅ Next.js config loaded. App starting on default port ");

const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "images.pexels.com" }],
  },
};

export default nextConfig;
