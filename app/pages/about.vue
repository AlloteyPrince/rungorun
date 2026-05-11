<script setup>
// Ensuring Nuxt recognizes this as a valid script block
</script>

<template>
  <NuxtLayout>
    <div class="min-h-screen bg-runblack pt-32 pb-20 px-6">
      <div class="container mx-auto max-w-4xl">
        <NuxtLink to="/" class="group flex items-center gap-2 text-gray-500 hover:text-rungreen transition-colors mb-12 uppercase font-black text-[10px] tracking-widest">
          <Icon name="heroicons:arrow-left-20-solid" class="group-hover:-translate-x-1 transition-transform" />
          Back to Gear
        </NuxtLink>

        <header class="mb-16">
          <span class="text-rungreen font-black tracking-[0.4em] text-[10px] uppercase mb-4 block">RUNGORUN / ORIGINS</span>
          <h1 class="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none text-white">
            THE <span class="text-rungreen neon-glow">SCIENCE</span> <br/> OF THE STRIDE
          </h1>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div class="md:col-span-8 space-y-12 text-gray-400 text-lg leading-relaxed">
            <section>
              <h4 class="text-white font-black uppercase tracking-widest text-xs mb-4">01 / The Vision</h4>
              <p>
                RunGoRun is a high-performance project born from a simple obsession: merging 
                <span class="text-white font-bold">clinical precision</span> with elite athletic lifestyle.
              </p>
            </section>
            <section>
              <h4 class="text-white font-black uppercase tracking-widest text-xs mb-4">02 / Clinical Standards</h4>
              <p>
                Rooted in <span class="text-rungreen font-bold">Clinical Herbalism</span>, we engineer for the heat and grit of the African athlete.
              </p>
            </section>
            <section>
              <h4 class="text-white font-black uppercase tracking-widest text-xs mb-4">03 / The Experience</h4>
              <p>
                We blend technical accuracy with aggressive streetwear aesthetics to make exercising the ultimate ritual of health.
              </p>
            </section>
          </div>

          <div class="md:col-span-4">
            <div class="glass p-8 space-y-8 sticky top-32 border border-white/10">
              <div>
                <h5 class="text-rungreen font-black text-[10px] uppercase tracking-widest mb-2">Location</h5>
                <p class="text-white font-bold uppercase tracking-tighter">Accra, Ghana</p>
              </div>
              <button @click="() => useWhatsApp().orderOnWhatsApp('About Page Inquiry', 'N/A')" 
                      class="w-full bg-white text-black py-4 font-black text-[10px] uppercase tracking-widest hover:bg-rungreen transition-all flex items-center justify-center gap-2">
                WhatsApp <Icon name="mdi:whatsapp" class="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.neon-glow { text-shadow: 0 0 15px rgba(223, 255, 0, 0.4); }
.glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(12px); }
</style>