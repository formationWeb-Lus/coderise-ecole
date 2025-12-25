/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,
  devIndicators: {
    buildActivity: false,
  },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  // 🔹 Ajouter cette partie pour next/image
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**", // autorise tous les chemins
      },
    ],
  },
};

module.exports = nextConfig;
