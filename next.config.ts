import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
