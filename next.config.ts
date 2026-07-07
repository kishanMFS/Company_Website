import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
  images: {
    remotePatterns : [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/images/**',
      },
    ]
  }
};

export default nextConfig;
