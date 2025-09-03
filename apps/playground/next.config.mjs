/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@elevenlabs/ui"],
  experimental: {
    viewTransition: true,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/playground",
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

export default nextConfig;
