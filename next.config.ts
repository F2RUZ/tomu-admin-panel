import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tomubackend.tomu.uz",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
