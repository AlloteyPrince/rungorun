<script setup>
useHead({ title: "About | RUNGORUN" });
</script>

<template>
  <div class="min-h-screen bg-runblack pt-32 pb-20">
    <div class="container mx-auto px-5 sm:px-6 max-w-6xl">

      <!-- HERO HEADER -->
      <header class="mb-20">
        <span
          class="text-rungreen font-black tracking-[0.4em] text-[10px] uppercase mb-6 block opacity-70"
        >
          RUNGORUN / ORIGINS
        </span>
        <h1
          class="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none text-white mb-8"
        >
          WE RUN <br /><span class="text-rungreen neon-glow">ACCRA.</span>
        </h1>
        <p
          class="text-gray-400 font-bold italic text-xl md:text-2xl leading-relaxed max-w-2xl border-l-4 border-rungreen pl-6"
        >
          This is not a clothing brand. This is a movement protocol — engineered
          for the streets, the tracks, and the heat of Ghana.
        </p>
      </header>

      <!-- MAIN GRID -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
        <!-- LEFT: STORY -->
        <div class="md:col-span-8 space-y-16">
          <section class="space-y-4">
            <h4
              class="text-rungreen font-black uppercase tracking-[0.4em] text-[10px] italic"
            >
              Built Here. For Here.
            </h4>
            <p class="text-gray-300 text-lg leading-relaxed font-bold italic">
              Run Go Run was built in Accra, for Accra. Most global brands
              design for Berlin or Boston and ship to you as an afterthought. We
              don't. Every product is engineered for 34-degree humidity, red
              dust, and tarmac — tested against our own
              <span class="text-white">Accra Active Circuit</span> standard
              before it ever reaches you. We don't release products to fill
              shelves. We release them when they're ready to perform.
            </p>
          </section>

          <section class="space-y-4">
            <h4
              class="text-rungreen font-black uppercase tracking-[0.4em] text-[10px] italic"
            >
              For Everyone Who Shows Up
            </h4>
            <p class="text-gray-300 text-lg leading-relaxed font-bold italic">
              This is for the person who set their alarm for 5:30am, hit snooze
              twice, argued with themselves — and laced up anyway. Walk half,
              run the rest. 2km or 20km. Just starting or getting back after a
              long break. The circuit doesn't judge your pace. It only asks that
              you keep moving — because making active living the default
              lifestyle of the Ghanaian generation is exactly why we exist.
            </p>
            <p
              class="text-white text-xl font-black italic border-l-4 border-rungreen pl-6"
            >
              Run Go Run. Because stopping was never an option.
            </p>
          </section>
        </div>

        <!-- RIGHT: SIDEBAR (hidden on mobile, visible on tablet+) -->
        <div class="md:col-span-4 space-y-6 hidden sm:block">
          <div class="sticky top-12 space-y-6">
            <!-- STAT CARD -->
            <div
              class="glass-card-deep rounded-[24px] border border-white/5 p-6 space-y-6"
            >
              <div class="border-b border-white/5 pb-4">
                <h5
                  class="text-rungreen font-black text-[10px] uppercase tracking-widest mb-1"
                >
                  Base
                </h5>
                <p
                  class="text-white font-black uppercase tracking-tighter text-lg"
                >
                  Accra, Ghana
                </p>
              </div>
              <div>
                <h5
                  class="text-rungreen font-black text-[10px] uppercase tracking-widest mb-1"
                >
                  Order_Channel
                </h5>
                <p
                  class="text-white font-black uppercase tracking-tighter text-lg"
                >
                  WhatsApp Terminal
                </p>
              </div>
            </div>

            <!-- MOTIVATIONAL PILL -->
            <div
              class="glass-card-deep rounded-[24px] border border-rungreen/20 p-6 space-y-3"
            >
              <h5
                class="text-rungreen font-black text-[10px] uppercase tracking-widest"
              >
                Daily_Transmission
              </h5>
              <p class="text-white font-black italic text-lg leading-snug">
                "The run you almost skipped is the one that changes everything."
              </p>
              <p
                class="text-gray-500 font-black text-[10px] uppercase tracking-widest"
              >
                — Run Go Run Circuit
              </p>
            </div>

            <!-- CTAs -->
            <NuxtLink
              to="/products"
              class="block w-full bg-rungreen text-black py-4 rounded-[16px] font-black text-[11px] uppercase tracking-widest text-center hover:bg-white transition-all"
            >
              Enter the Inventory
            </NuxtLink>

            <button
              @click="() => (useState('contact_modal').value = true)"
              class="block w-full border border-white/10 text-white py-4 rounded-[16px] font-black text-[11px] uppercase tracking-widest text-center hover:border-rungreen hover:text-rungreen transition-all"
            >
              Open Support Terminal
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.neon-glow {
  text-shadow: 0 0 20px rgba(223, 255, 0, 0.5);
}

.glass-card-deep {
  background: linear-gradient(
    160deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.01) 100%
  );
  backdrop-filter: blur(80px);
}
</style>
