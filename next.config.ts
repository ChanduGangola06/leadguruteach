import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained production folder for VPS upload (paste) — no npm install on server
  output: "standalone",
  transpilePackages: ["@splinetool/react-spline"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
