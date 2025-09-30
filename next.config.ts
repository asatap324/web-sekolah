import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    formats: ["image/avif", "image/webp"], // serve modern format
    deviceSizes: [320, 480, 768, 1024, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dvwrfhxzfftjxcpxusfd.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "avatar.iran.liara.run",
        pathname: "/public/45",
      },
    ],
  },
};

export default nextConfig;
