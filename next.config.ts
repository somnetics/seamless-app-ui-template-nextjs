import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  experimental: {
    proxyTimeout: 1000 * 60 * 5
  },
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development"
  },
  async rewrites() {
    return [
      {
        source: "/seamless/auth/:path*",
        destination: `${process.env.NEXT_PUBLIC_SEAMLESS_AUTH_API_HOST}/:path*`
      }
    ]
  }
};

export default nextConfig;
