export default defineNuxtConfig({
  // future: {
  //   compatibilityVersion: 4,
  // },
  srcDir: 'app/',
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon'],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  nitro: {
    preset: 'netlify'}
})