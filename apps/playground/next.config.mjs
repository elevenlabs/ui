import { createMDX } from "fumadocs-mdx/next"

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  outputFileTracingIncludes: {
    "/*": ["./registry/**/*"],
  },
  transpilePackages: ["@elevenlabs/ui"],
  experimental: {
    viewTransition: true,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/docs",
        permanent: true,
      },
      {
        source: "/playground",
        destination: "/playground/agents",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({})

export default withMDX(nextConfig)
