import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  trailingSlash: false,
  reactStrictMode: false,
  images: {
    formats: ["image/avif", "image/webp"], // serve modern format
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dvwrfhxzfftjxcpxusfd.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "avatar.iran.liara.run",
        pathname: "/public/**",
      },
    ],
  },
};

export default nextConfig;
