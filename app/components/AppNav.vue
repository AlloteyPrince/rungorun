<script setup>
/**
 * Nuxt 4 logic to handle cross-page anchor scrolling.
 */
const router = useRouter()
const route = useRoute()
const showContact = useState('contact_modal')
const isMobileMenuOpen = ref(false)

const navLinks = [
  { name: 'Home', path: '#hero' },
  { name: 'Categories', path: '#categories' },
  { name: 'About', path: '/about' }
]

const handleNavClick = async (path) => {
  isMobileMenuOpen.value = false 
  
  if (path.startsWith('#')) {
    if (route.path === '/') {
      const el = document.querySelector(path)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      await router.push('/')
      setTimeout(() => {
        const el = document.querySelector(path)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }, 300)
    }
  } else {
    await router.push(path)
  }
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<template>
  <nav class="fixed top-0 w-full z-[100] glass py-4 md:py-6">
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
      <div class="flex items-center gap-6">
        <!-- Accra Live Pulse -->
        <div class="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
          <div class="w-2 h-2 bg-rungreen rounded-full animate-pulse shadow-[0_0_10px_#dfff00]"></div>
          <span class="text-[10px] font-black tracking-[0.2em] text-rungreen uppercase italic">Accra Live</span>
        </div>

        <!-- Mobile Toggle -->
        <button @click="toggleMobileMenu" class="md:hidden text-white transition-transform active:scale-90">
          <Icon :name="isMobileMenuOpen ? 'ph:x-bold' : 'ph:list-bold'" class="text-3xl" />
        </button>
      </div>
    </div>

    <!-- ── MOBILE MENU OVERLAY ── -->
    <Transition name="fade">
      <div v-if="isMobileMenuOpen" class="fixed inset-0 top-[72px] bg-black/95 backdrop-blur-2xl z-50 md:hidden overflow-hidden">
        <div class="flex flex-col p-10 gap-8 h-full justify-center">
          <button 
            v-for="link in navLinks" 
            :key="link.name" 
            @click="handleNavClick(link.path)"
            class="text-5xl font-black italic uppercase tracking-tighter text-left font-['Poppins'] hover:text-rungreen transition-colors text-white"
          >
            {{ link.name }}
          </button>
          <button 
            @click="showContact = true; isMobileMenuOpen = false" 
            class="text-5xl font-black italic uppercase tracking-tighter text-left font-['Poppins'] text-rungreen"
          >
            Contact
          </button>
          
          <div class="mt-10 pt-10 border-t border-white/10">
            <p class="text-xs font-black uppercase tracking-widest text-gray-500 italic">Clinical Herbalism & Performance</p>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.glass {
  background: rgba(8, 8, 8, 0.75);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.neon-glow {
  text-shadow: 0 0 15px rgba(223, 255, 0, 0.4);
}

.fade-enter-active, .fade-leave-active { 
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); 
}
.fade-enter-from, .fade-leave-to { 
  opacity: 0; 
  transform: translateY(-10px); 
}
</style>