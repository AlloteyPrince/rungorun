import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        'rungreen': '#DFFF00', // The neon fire color
        'runblack': '#0A0A0A', // Matte black background
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    }
  }
}