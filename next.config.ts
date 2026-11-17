import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    outputFileTracingIncludes: {
      "/*": ["./node_modules/argon2/prebuilds/**/*"],
    },
  },
};

export default nextConfig;