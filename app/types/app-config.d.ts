// types/app-config.d.ts
declare module 'nuxt/schema' {
  interface AppConfig {
    brand: {
      name: string
      slogan: string
      whatsappNumber: string
      whatsappMessage: string
    }
    theme: {
      primaryColor: string
      secondaryColor: string
      accentColor: string
      backgroundColor: string
      textColor: string
    }
    content: {
      ctaText: string
      heroTitle: string
      heroSubtitle: string
    }
  }
}

export {}