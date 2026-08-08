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
        { name: 'keywords', content: 'running gear Accra, jogging gear Ghana, running vest Accra, jogging vest, phone armband for running, running armband Ghana, running accessories Ghana, jogging accessories Accra, runner accessories, running apparel Ghana, jogging apparel Accra, running clothes Ghana, jogging outfit, sportswear Accra, sportswear Ghana, athletic wear Ghana, workout gear Accra, workout accessories Ghana, fitness gear Ghana, fitness accessories Accra, exercise gear Ghana, cardio gear Accra, buy running gear online Ghana, running gear delivery Accra, running store Ghana, jogging store Accra, WhatsApp shopping running gear, best running gear Accra, running gear for hot weather, jogging gear for humidity, how to start jogging, jogging tips Accra, running tips Ghana, marathon training gear, 5k training gear, running gear for beginners, running training guide, running gear reviews, morning run gear, early morning jogging gear, Accra running community, Ghana running brand, jogging community Ghana, run club Accra, active lifestyle Ghana, active living Accra, fitness lifestyle Ghana, keep fit Ghana, keeping fit Accra, running gear for runners, running shorts Ghana, running socks Accra, moisture wicking running gear, breathable running vest, reflective running gear, running hydration gear, running waist pouch, sports armband for phone, running headband, compression gear running, running gloves Accra, no-slip phone armband, sweat proof running gear, running gear for men Ghana, running gear for women Ghana, unisex running gear, running gear for tropical climate, humidity proof workout gear, breathable jogging clothes, sun protection running gear, lightweight running gear, benefits of jogging, running for weight loss, jogging for beginners guide, cardio workout at home, outdoor cardio Ghana, healthy lifestyle Ghana, wellness Ghana, movement is medicine, active recovery gear, injury prevention running, running routes Accra, jogging spots Accra, Tema running gear, East Legon running store, Kumasi running gear, running gear Kasoa, track and field gear Ghana, athletics gear Ghana, sprinting gear, half marathon training gear, 10k training gear, race day gear, trail running gear Ghana, treadmill workout gear, urban running gear, night running gear, reflective jogging gear, running safety gear, Ghanaian running brand, El Wak Stadium running track, Independence Square jogging, Black Star Square morning run, University of Ghana Legon running track, Aburi Botanical Gardens jogging trail, Achimota Forest running trail, Labadi Beach jogging, La Beach morning run, Airport Residential Area running route, Trasacco Valley jogging route, Roman Ridge running route, Ridge Accra jogging route, Efua Sutherland Park running, Accra Sports Stadium running track, Dzorwulu jogging route, Kwame Nkrumah Circle jogging, Cantonments running route, Osu jogging route, North Ridge running spot, Spintex Road morning jog, health benefits of running, cardiovascular benefits of running, mental health benefits of running, running for stress relief, running for heart health, jogging for weight loss, running boosts immune system, running for mental clarity, jogging reduces stress, benefits of morning run, running for longevity, jogging for diabetes prevention, running for better sleep, runner\'s high, running for stamina, jogging for energy boost, benefits of outdoor exercise, running for bone health, jogging for blood pressure, running for lung capacity, running for mental wellbeing, jogging for anxiety relief, running for muscle tone, daily jogging benefits, running for a healthy heart, running belt, running sunglasses, no chafe running gear, blister prevention socks, running cap Ghana, sun hat for running, cooling towel for running, hydration vest running, running backpack, fitness tracker armband, waterproof phone pouch running, anti-chafe running gear, quick dry running shirt, breathable running shorts, high visibility running gear, running gear for rainy season, running gear for beginners Ghana, durable running gear, comfortable running gear, affordable running gear Ghana, premium sportswear Ghana, running gear for students Ghana, running gear for women beginners, running gear for men beginners, stylish running gear Ghana, jogging routine for beginners, running schedule for beginners, couch to 5k Ghana, interval training running, tempo run tips, long distance running gear, sprint training gear, HIIT running gear, running warm up tips, running cool down tips, stretching for runners, proper running technique, running pace tips, nutrition for runners, post-run recovery tips, Accra marathon, Milo marathon Ghana, charity run Accra, 5k run Accra, 10k race Ghana, fun run Accra, sunrise run Accra, group jogging Accra, running buddy Accra, social running club Ghana, running, jogging, marathon, track running, road running' },
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
      const { supabase } = await import('./app/lib/supabase')

      const { data: products } = await supabase
        .from('products')
        .select('id, updated_at')
        .eq('published', true)

      const productUrls = (products || []).map((product) => ({
        loc: `/products/${product.id}`,
        lastmod: product.updated_at || new Date().toISOString()
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