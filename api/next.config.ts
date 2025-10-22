import type { NextConfig } from "next";

// Ensure native modules resolve at runtime in the server build
const nextConfig: NextConfig = {
  serverExternalPackages: ["sqlite3", "sequelize"],
};

export default nextConfig;
