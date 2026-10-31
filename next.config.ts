import type { NextConfig } from "next";

/* Vercel manages its own build output — standalone is for self-hosting the sandbox */
const isVercel = Boolean(process.env.VERCEL);

const nextConfig: NextConfig = {
  ...(isVercel ? {} : { output: "standalone" as const }),
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
