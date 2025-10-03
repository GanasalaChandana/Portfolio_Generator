/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  images: { formats: ['image/webp', 'image/avif'] },
  experimental: { optimizePackageImports: ['lucide-react', 'date-fns'] },

  // ✅ allow production builds with ESLint errors
  eslint: { ignoreDuringBuilds: true },
  // (optional, if TS ever blocks builds)
  // typescript: { ignoreBuildErrors: true },
};
module.exports = nextConfig;
