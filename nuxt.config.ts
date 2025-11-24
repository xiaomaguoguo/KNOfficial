// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    'nuxt-gtag',
    '@nuxt/content',
    '@vite-pwa/nuxt'
  ],

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      id: '/', // 明确的应用 ID，防止更新后重复安装
      name: 'KNothing - Developer Tools',
      short_name: 'KNothing',
      description: 'Privacy-first, client-side developer tools.',
      theme_color: '#0f172a', // 你的暗黑主题色
      background_color: '#0f172a',
      display: 'standalone', // 隐藏浏览器地址栏
      orientation: 'any',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable' // 🔴 必须要有这一项，安卓自适应图标
        }
      ],
      // 🔴 新增：应用截图配置 (让安装提示更容易出现)
      screenshots: [
        {
          src: 'screenshot-mobile.png',
          sizes: '736x1588', // ⚠️ 请改为你 mobile 图片的真实尺寸 (宽x高)
          type: 'image/png',
          form_factor: 'narrow',
          label: 'Mobile View'
        },
        {
          src: 'screenshot-desktop.png',
          sizes: '3810x1744', // ⚠️ 请改为你 desktop 图片的真实尺寸 (宽x高)
          type: 'image/png',
          form_factor: 'wide',
          label: 'Desktop Dashboard'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'], // 缓存策略
      cleanupOutdatedCaches: true,
      navigateFallbackDenylist: [/^\/sitemap\.xml$/]
    },
    client: {
      installPrompt: true, // 允许客户端拦截安装事件
      periodicSyncForUpdates: 3600 // 每小时检查更新
    },
    devOptions: {
      enabled: true, // 本地开发也能看到 PWA 效果
      suppressWarnings: true,
      navigateFallback: '/',
      type: 'module',
    },
  },

  content: {
    highlight: {
      theme: 'github-dark'
    }
  },

  site: {
    url: 'https://knothing.com'
  },

  sitemap: {
    strictNuxtContentPaths: true,
    autoLastmod: true
  },

  robots: {
    groups: [
      {
        userAgent: ['*'],
        allow: ['/']
      }
    ]
  },

  gtag: {
    id: 'G-EZD472H7WB' // Set your G-XXXXXXXXXX ID here or in .env
  },

  nitro: {
    preset: 'cloudflare-pages',
    prerender: {
      routes: ['/sitemap.xml']
    }
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      title: 'KNothing - Vertical AI Tool Station',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A collection of powerful, minimalist AI tools.' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'manifest', href: '/manifest.webmanifest' }, // 注意后缀是 webmanifest 还是 json，你之前下载的是 webmanifest
        { rel: 'apple-touch-icon', href: '/pwa-192x192.png' } // 让苹果设备也开心
      ]
    }
  }
})