<script setup>
const router = useRouter()
const route = useRoute()
const showContact = useState('contact_modal')
const { isMobileMenuOpen, closeMenu, toggleMenu } = useMobileMenu()

const navLinks = [
  { name: 'Home', path: '#hero' },
  { name: 'Categories', path: '#categories' },
  { name: 'About', path: '/about' }
]

const handleNavClick = async (path) => {
  closeMenu()
  if (path.startsWith('#')) {
    if (route.path === '/') {
      const el = document.querySelector(path)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      await router.push('/')
      setTimeout(() => {
        const el = document.querySelector(path)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    }
  } else {
    await router.push(path)
  }
}
</script>

<template>
  <nav class="fixed top-0 w-full z-[150] glass py-4 md:py-6">
    <div class="container mx-auto px-5 sm:px-6 max-w-6xl flex justify-between items-center">
      
      <!-- Logo -->
      <NuxtLink to="/" class="text-xl md:text-2xl font-black italic tracking-tighter uppercase font-['Poppins'] text-white">
        RUN<span class="text-rungreen neon-glow">GO</span>RUN
      </NuxtLink>

      <!-- Desktop Links -->
      <div class="hidden md:flex items-center gap-10 font-black text-xs tracking-[0.2em] uppercase italic">
        <button 
          v-for="link in navLinks" 
          :key="link.name" 
          @click="handleNavClick(link.path)" 
          class="hover:text-rungreen transition-colors text-gray-300"
        >
          {{ link.name }}
        </button>
        <button 
          @click="showContact = true" 
          class="px-7 py-2.5 border border-rungreen/30 rounded-full text-rungreen hover:bg-rungreen hover:text-black transition-all"
        >
          Contact Us
        </button>
      </div>

      <!-- Status & Mobile Trigger -->
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
          <div class="w-2 h-2 bg-rungreen rounded-full animate-pulse shadow-[0_0_10px_#dfff00]"></div>
          <span class="text-[10px] font-black tracking-[0.2em] text-rungreen uppercase italic">Live</span>
        </div>
        <button 
          @click="toggleMenu" 
          class="md:hidden text-white transition-all duration-300 active:scale-90"
        >
          <Icon name="ph:list-bold" class="text-3xl" />
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.glass {
  background: rgba(8, 8, 8, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.neon-glow {
  text-shadow: 0 0 15px rgba(223, 255, 0, 0.6);
}
</style>