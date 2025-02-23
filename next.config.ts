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
    // Отключаем ESLint во время сборки
    eslint: {
      ignoreDuringBuilds: true,
    },
      // Отключаем проверку типов при сборке для начала
  typescript: {
    ignoreBuildErrors: true,
  },
  // webpack: (config) => {
  //   config.externals = "commonjs argon2";
  //   return config;
  // }

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          argon2: false,
          fs: false,
          crypto: false,
          path: false,
          os: false,
          buffer: false,
          pg: false,
          'pg-native': false
        }
      };
    }

    config.externals = [
      ...(config.externals || []),
      { argon2: 'argon2' }
    ];

    return config;
  }
};

export default nextConfig;

  // webpack: (config) => {
  //   config.resolve.fallback = {
  //     ...config.resolve.fallback,
  //     crypto: false,
  //     dns: false,
  //     net: false,
  //     tls: false,
  //     fs: false,
  //   };

  //   config.externals = [...(config.externals || []), "pg-native"];

  //   return config;
  // },
