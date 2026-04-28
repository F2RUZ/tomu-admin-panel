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
  // Video upload uchun body size limit yo'q
  experimental: {
    serverActions: {
      bodySizeLimit: "500mb",
    },
  },
};

export default nextConfig;
