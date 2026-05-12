<script setup>
const showContact = useState('contact_modal', () => false)

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
    <AppNavbar />

    <!-- PAGE CONTENT -->
    <main>
      <slot />
    </main>

    <!-- FOOTER COMPONENT -->
    <AppFooter />

    <!-- GLOBAL CONTACT MODAL -->
    <Transition name="fade">
      <div v-if="showContact" class="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-runblack/95 backdrop-blur-md">
        <div class="glass-card-deep max-w-xl w-full p-12 rounded-[40px] border border-white/5 relative">
          <button @click="showContact = false" class="absolute top-8 right-8 text-white/40 hover:text-rungreen transition-colors">
            <Icon name="ph:x-bold" class="text-2xl" />
          </button>
          <h2 class="text-5xl font-black italic uppercase tracking-tighter mb-4 font-['Poppins']">
            Contact <span class="text-rungreen">Terminal.</span>
          </h2>
          <p class="text-gray-500 font-bold italic mb-10 text-lg leading-tight">Direct link to the Accra Active support circuit.</p>
          <a href="https://wa.me/yournumber" class="btn-global block text-center bg-rungreen text-black py-6 rounded-[30px] font-black italic uppercase text-xl">
            Open WhatsApp
          </a>
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
/* Global Styles from your index.vue */
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@1,900&family=Urbanist:ital,wght@0,300;0,400;0,700;0,900;1,300;1,700;1,900&display=swap');

.glass-card-deep { background: linear-gradient(160deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%); backdrop-filter: blur(80px); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@keyframes pulse-global { 
  0% { box-shadow: 0 0 0 0 rgba(223, 255, 0, 0.6); } 
  70% { box-shadow: 0 0 0 30px rgba(223, 255, 0, 0); } 
  100% { box-shadow: 0 0 0 0 rgba(223, 255, 0, 0); } 
}
.btn-global { animation: pulse-global 2s infinite; }

html { scroll-behavior: smooth; background: #000; }
</style>