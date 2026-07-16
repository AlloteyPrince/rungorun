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
      const { supabase } = await import('./app/lib/supabase')

      const productUrls = products.map((product) => ({
        loc: `/products/${product.id}`,
        lastmod: new Date().toISOString()
      }))

      const { data: posts } = await supabase
        .from('posts')
        .select('slug, updated_at')
        .eq('published', true)

      const blogUrls = (posts || []).map((post) => ({
        loc: `/blog/${post.slug}`,
        lastmod: post.updated_at || new Date().toISOString()
      }))

      return [...productUrls, ...blogUrls]
    }
  },
  nitro: {
    preset: 'netlify'
  }
})