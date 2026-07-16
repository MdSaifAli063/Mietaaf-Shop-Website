import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep `next dev` and `next build` from overwriting each other's manifests.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  devIndicators: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      // Allow any HTTPS image URL so admin-configured logo URLs always work
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
