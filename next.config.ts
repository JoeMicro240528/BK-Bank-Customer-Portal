import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Dockerfile runs `node server.js` from .next/standalone, which only
  // exists when this is set.
  output: "standalone",
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
