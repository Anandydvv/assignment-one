import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  //output: "standalone", // ✅ important for Docker build
};

export default nextConfig;
