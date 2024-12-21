import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Ensure this matches the Cloudinary hostname
        port: "", // Leave this empty
        pathname: "/**", // Allow all paths under this hostname
      },
    ],
  },
};

export default nextConfig;
