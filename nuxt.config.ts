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
      htmlAttrs: {
        lang: 'en'
      },
      title: 'Run Go Run | Premium Running Gear for Accra Runners',
      meta: [
        { name: 'google-site-verification', content: 'mBJhPlOSC2vRdoWeJoB78zrCWDhIiEyEI_O-3NucdIc' },
        { name: 'description', content: 'Engineered running gear built for Accra\'s heat and hustle. Vests, armbands, shorts, and gear made for runners who earn it every day. Shop rungorun.store.' },
        { name: 'theme-color', content: '#0A0A0A' },
        { property: 'og:title', content: 'Run Go Run | Premium Running Gear for Accra Runners' },
        { property: 'og:description', content: 'Engineered running gear built for Accra\'s heat and hustle. Earn it every day.' },
        { property: 'og:image', content: 'https://rungorun.store/og-image.jpg' },
        { property: 'og:url', content: 'https://rungorun.store' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Run Go Run' },
        { property: 'og:locale', content: 'en_GH' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Run Go Run | Premium Running Gear for Accra Runners' },
        { name: 'twitter:description', content: 'Engineered running gear built for Accra\'s heat and hustle. Earn it every day.' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
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