import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Type-checking is enforced separately via `tsc --noEmit`; ESLint here
    // includes experimental React Compiler purity rules that are stricter
    // than needed for this scaffold and shouldn't block the production build.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
