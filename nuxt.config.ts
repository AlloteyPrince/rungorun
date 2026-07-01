import tsconfigPaths from 'vite-tsconfig-paths'
import { resolve } from 'path'

export default defineNuxtConfig({
  // ✅ Add this to remove the warning
  compatibilityDate: '2026-07-01',
  
  srcDir: 'app/',
  vite: {
    plugins: [tsconfigPaths()]
  },
  alias: {
    '@': resolve(__dirname, 'app'), // Tell Nuxt that @ points to app/
  },
  typescript: {
    typeCheck: false,
    strict: false,
    tsConfig: {
      include: ['app/**/*', 'nuxt.config.ts']
    }
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon'],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  nitro: {
    preset: 'netlify'
  }
})