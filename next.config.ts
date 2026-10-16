import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Keep metadata in the initial head for search/social/AI readers, and resolve
  // unavailable catalogue routes before response headers are streamed.
  htmlLimitedBots: /.*/,
  // Keep `next dev` and `next build` from overwriting each other's manifests.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  devIndicators: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...(process.env.VERCEL_ENV === "preview" || process.env.NEXT_PUBLIC_INDEXING_DISABLED === "true"
            ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]
            : []),
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
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
      {
        protocol: "https",
        hostname: "bwo.co.in",
        pathname: "/cdn/shop/files/**",
      },
    ],
  },
};

export default nextConfig;
