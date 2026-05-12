<script setup>
const showContact = useState('contact_modal', () => false)
const { isMobileMenuOpen, closeMenu } = useMobileMenu()

const router = useRouter()
const route = useRoute()

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

const shareWebsite = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'RUN GO RUN',
        text: 'Optimize your momentum.',
        url: window.location.href,
      })
    } catch (err) { console.log('Share failed') }
  } else {
    await navigator.clipboard.writeText(window.location.href)
    alert('Link Copied to Clipboard')
  }
}
</script>

<template>
  <div class="min-h-screen bg-runblack text-white font-['Urbanist'] selection:bg-rungreen selection:text-black">
    
    <!-- NAVIGATION COMPONENT -->
    <header class="relative z-[150]">
      <AppNavbar />
    </header>

    <!-- PAGE CONTENT -->
    <main class="relative z-10">
      <slot />
    </main>

    <!-- FOOTER COMPONENT -->
    <AppFooter />

    <!-- GLOBAL CONTACT MODAL -->
    <Transition name="fade">
      <div 
        v-if="showContact" 
        @click.self="showContact = false"
        class="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-runblack/95 backdrop-blur-md cursor-pointer"
      >
        <div class="glass-card-deep max-w-2xl w-full p-8 md:p-12 rounded-[40px] border border-white/5 relative cursor-default">
          <button 
            @click="showContact = false" 
            class="absolute top-8 right-8 text-white/40 hover:text-rungreen hover:rotate-[180deg] transition-all duration-700"
          >
            <Icon name="ph:x-bold" class="text-2xl" />
          </button>
          <h2 class="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-2 font-['Poppins']">
            Support <span class="text-rungreen">& Feedback.</span>
          </h2>
          <p class="text-gray-500 font-bold italic mb-10 text-sm md:text-base leading-tight uppercase tracking-widest">
            Directly to the RUNGORUN team.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
            <div class="p-6 rounded-[30px] bg-white/5 border border-white/10">
              <Icon name="ph:warning-circle-bold" class="text-rungreen text-3xl mb-3" />
              <h3 class="font-black italic uppercase text-lg mb-1 leading-none">Complaints</h3>
              <p class="text-[11px] text-gray-500 leading-tight">Issues with an order? We resolve support tickets via WhatsApp within 24 hours.</p>
            </div>
            <div class="p-6 rounded-[30px] bg-white/5 border border-white/10">
              <Icon name="ph:chat-teardrop-dots-bold" class="text-rungreen text-3xl mb-3" />
              <h3 class="font-black italic uppercase text-lg mb-1 leading-none">Suggestions</h3>
              <p class="text-[11px] text-gray-500 leading-tight">Help us grow. We build features based directly on community feedback.</p>
            </div>
          </div>
          <div class="space-y-4">
            <a 
              href="https://wa.me/233270751657" 
              target="_blank" 
              class="btn-global flex items-center gap-4 px-6 py-5 rounded-[25px] bg-rungreen text-black hover:scale-[1.02] transition-all duration-500"
            >
              <Icon name="ph:whatsapp-logo-bold" class="text-4xl" />
              <div class="flex-1 text-left">
                <!-- <p class="text-[10px] uppercase font-black leading-none opacity-70 mb-1">Instant Support Circuit</p> -->
                <p class="font-black text-xl md:text-2xl leading-tight uppercase italic">Contact us</p>
              </div>
              <Icon name="ph:arrow-right-bold" class="text-2xl" />
            </a>
            <div class="flex items-center justify-center gap-3 py-4 border-t border-white/5 mt-4">
              <Icon name="ph:map-pin-fill" class="text-gray-600 text-sm" />
              <p class="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]">RunGoRun | Accra Ghana</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- MOBILE MENU BACKDROP -->
    <Transition name="fade">
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 z-[190] bg-black/60 backdrop-blur-sm md:hidden"
        @click="closeMenu"
      />
    </Transition>

    <!-- MOBILE MENU DRAWER -->
    <Transition name="drawer">
      <div
        v-if="isMobileMenuOpen"
        class="fixed top-0 right-0 h-full w-[70%] z-[200] md:hidden flex flex-col px-8 pt-24 pb-12 border-l border-white/10"
        style="background: #000000;"
      >
        <!-- Close Button -->
        <button
          @click="closeMenu"
          class="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-rungreen hover:text-rungreen transition-all"
        >
          <Icon name="ph:x-bold" class="text-lg" />
        </button>

        <!-- Nav Links -->
        <div class="flex flex-col gap-2 flex-1">
          <button
            v-for="link in navLinks"
            :key="link.name"
            @click="handleNavClick(link.path)"
            class="text-lg font-black italic uppercase tracking-widest text-left text-white/70 hover:text-white py-4 border-b border-white/5 transition-colors"
          >
            {{ link.name }}
          </button>
          <button
            @click="showContact = true; closeMenu()"
            class="text-lg font-black italic uppercase tracking-widest text-left text-white/70 hover:text-white py-4 border-b border-white/5 transition-colors"
          >
            Contact
          </button>
        </div>

        <!-- Bottom Metadata -->
        <div class="pt-8 border-t border-white/10">
          <p class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic mb-3">Protocol Status</p>
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 bg-rungreen rounded-full animate-pulse"></div>
            <span class="text-[10px] font-black text-rungreen uppercase tracking-widest italic">Accra Circuit | Optimal</span>
          </div>
        </div>
      </div>
    </Transition>

    <!-- GLOBAL BROADCAST BUTTON -->
    <button @click="shareWebsite" class="fixed bottom-8 right-8 z-[100] w-14 h-14 md:w-16 md:h-16 rounded-full glass border border-rungreen/30 flex items-center justify-center group hover:scale-110 active:scale-95 transition-all duration-500">
      <div class="absolute inset-0 rounded-full bg-rungreen/10 animate-ping"></div>
      <Icon name="ph:broadcast-bold" class="text-2xl md:text-3xl text-rungreen" />
    </button>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@1,900&family=Urbanist:ital,wght@0,300;0,400;0,700;0,900;1,300;1,700;1,900&display=swap');

.glass-card-deep { 
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%); 
  backdrop-filter: blur(80px); 
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.drawer-enter-active, .drawer-leave-active { transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1); }
.drawer-enter-from, .drawer-leave-to { transform: translateX(100%); }

@keyframes pulse-global { 
  0% { box-shadow: 0 0 0 0 rgba(223, 255, 0, 0.6); } 
  70% { box-shadow: 0 0 0 30px rgba(223, 255, 0, 0); } 
  100% { box-shadow: 0 0 0 0 rgba(223, 255, 0, 0); } 
}
.btn-global { animation: pulse-global 2s infinite; }

html { scroll-behavior: smooth; background: #000; }

body.menu-open { overflow: hidden; }
</style>