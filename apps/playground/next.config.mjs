/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@elevenlabs/ui"],
  async redirects() {
    return [
      {
        source: "/",
        destination: "/playground",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
