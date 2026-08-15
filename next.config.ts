import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Cache optimized images for 30 days.
    // WebP only: AVIF looks slightly smaller but first-hit encode of large
    // photos is slow (especially in dev / cold CDN), which hurts LCP heroes.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    formats: ["image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
