let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['images.unsplash.com', 'api.dicebear.com', 'source.unsplash.com', 'ui-avatars.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'production', // Для статических экспортов, если нужно
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
    serverActions: true,
  },
  // Настройка для пропуска статической генерации для определенных путей
  skipTrailingSlashRedirect: true,
  // Определение специальных динамических маршрутов
  unstable_runtimeJS: true,
  swcMinify: true,
  // Предотвращение попыток статической генерации для некоторых путей
  reactStrictMode: false,
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    }
    return config;
  },
  env: {
    NEXT_FORCE_DYNAMIC_ROUTES: 'jobs/[slug],blog/[slug],subscription/checkout,saved-projects,canvasx',
  },
  // Отключить автоматическую статическую оптимизацию для страниц, которые используют динамические данные
  trailingSlash: false
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default nextConfig