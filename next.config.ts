import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  serverExternalPackages: ["argon2"],
  outputFileTracingIncludes: {
    "/*": ["./node_modules/argon2/prebuilds/**/*"],
  },
};

export default nextConfig;