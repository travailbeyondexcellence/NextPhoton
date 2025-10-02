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
  // Fix Watchpack file watcher errors by using snapshot mode instead of watching
  webpack: (config, { isServer }) => {
    // Use snapshot mode to avoid file watching issues
    config.snapshot = {
      managedPaths: [/^(.+?\/node_modules\/)/],
      immutablePaths: [],
      buildDependencies: {
        hash: true,
        timestamp: true,
      },
    };

    // Configure file watcher with proper ignore patterns
    config.watchOptions = {
      ignored: ['**/node_modules/**', '**/.git/**', '**/.next/**'],
      aggregateTimeout: 300,
    };

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
