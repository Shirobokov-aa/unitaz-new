import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Устанавливаем ограничение размера тела запроса в 5MB
      bodySizeLimit: "5mb",
      // Разрешаем все источники (в продакшене лучше указать конкретные домены)
      allowedOrigins: ["*"]
    }
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: false,
      dns: false,
      net: false,
      tls: false,
      fs: false,
    };

    config.externals = [...(config.externals || []), "pg-native"];

    return config;
  },
};

export default nextConfig;
