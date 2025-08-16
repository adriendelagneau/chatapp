import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // For Google profile pictures
        port: "",
      },
    ],
  },
};

export default nextConfig;
