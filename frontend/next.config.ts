import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["192.168.0.16", "192.168.0.16:3000", "localhost", "127.0.0.1"],
};

export default nextConfig;
