import tsconfigPaths from 'vite-tsconfig-paths'
import { resolve } from 'path'

export default defineNuxtConfig({
  compatibilityDate: '2026-07-01',

  srcDir: 'app/',
  vite: {
    plugins: [tsconfigPaths()]
  },
  alias: {
    '@': resolve(__dirname, 'app'),
  },
  typescript: {
    typeCheck: false,
    strict: false,
    tsConfig: {
      include: ['app/**/*', 'nuxt.config.ts']
    }
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon', '@nuxtjs/sitemap'],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  app: {
    head: {
      meta: [
        { name: 'google-site-verification', content: 'mBJhPlOSC2vRdoWeJoB78zrCWDhIiEyEI_O-3NucdIc' }
      ]
    }
  },
  site: {
    url: 'https://rungorun.store'
  },

  sitemap: {
    exclude: ['/admin/**'],
    urls: async () => {
      const { products } = await import('./app/data/products')
      return products.map((product) => ({
        loc: `/products/${product.id}`,
        lastmod: new Date().toISOString()
      }))
    }
  },
  nitro: {
    preset: 'netlify'
  }
})