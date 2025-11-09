import type { NextConfig } from "next";
import path from "path";
// import createMDX from '@next/mdx';
// import rehypePrism from "rehype-prism-plus";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  devIndicators: false,
  experimental: {
    proxyTimeout: 1000 * 60 * 5,
    mdxRs: true
  },
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development"
  },
  async rewrites() {
    return [
      {
        source: "/seamless/:path*",
        destination: `${process.env.NEXT_PUBLIC_SEAMLESS_AUTH_API_HOST}/:path*`
      }
    ]
  },
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  webpack(config) {
    config.module.rules.push({
      // test: /\.mdx$/,
      // use: [
      //   {
      //     loader: "@mdx-js/loader",
      //     options: {
      //       rehypePlugins: [rehypePrism],
      //     },
      //   },
      // ],
      // test: /\.md$/,
      // This is the asset module.
      // loader: 'raw-loader'
    });
    return config;
  },
  turbopack: {
    root: path.join(__dirname, '..'),
  },
};

// create mdx
// const withMDX = createMDX({
//   // Add markdown plugins here, as desired
//   extension: /\.(md|mdx)$/,
// });

// Merge MDX config with Next.js config
// export default withMDX(nextConfig);
export default nextConfig;
