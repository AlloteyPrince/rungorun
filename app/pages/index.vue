<script setup>
import { useWhatsApp } from '~/composables/useWhatsApp'

// Global State for the Modal
const showContact = useState('contact_modal', () => false)
const { orderOnWhatsApp } = useWhatsApp()

const visibleSections = ref(new Set())

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visibleSections.value.add(entry.target.id)
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('section').forEach(s => observer.observe(s))
})

const categories = [
  { name: 'Apparel', sub: 'The Run Kits', desc: 'Engineering the perfect run kit for the Accra climate.', icon: 'ph:t-shirt-bold' },
  { name: 'Access -ories', sub: 'The Move Gear', desc: 'Strategic gear for the mobile athlete and hydration.', icon: 'ph:backpack-bold' },
  { name: 'Support', sub: 'Recovery Lab', desc: 'Scientific recovery systems and herbal topicals.', icon: 'ph:first-aid-kit-bold' },
  { name: 'Metric Tech', sub: 'Vitals', desc: 'Data-driven results and smart sensors for tracking.', icon: 'ph:cpu-bold' }
]

const trustItems1 = [
  { text: 'Fast Local Delivery', emoji: '🚀' },
  { text: 'WhatsApp Ordering', emoji: '💬' },
  { text: 'Premium Quality', emoji: '⭐' },
  { text: 'Sweat-Proof Gear', emoji: '💪' },
  { text: 'Herballo Wellness Partner', emoji: '🌿' },
  { text: 'All Phone Sizes', emoji: '📱' },
  { text: 'Accra Fast Delivery', emoji: '📦' },
  { text: 'Built For Runners', emoji: '🏃' },
]

const trustItems2 = [
  { text: 'Run Go Run', emoji: '🏃' },
  { text: 'Herballo Health Tips', emoji: '🌿' },
  { text: 'Healthy Living', emoji: '💚' },
  { text: 'Movement Is Medicine', emoji: '🩺' },
  { text: 'Free Tip Card In Every Order', emoji: '🎁' },
  { text: 'Book A Consultation', emoji: '📅' },
  { text: 'Active Lifestyle', emoji: '⚡' },
  { text: 'Accra Ghana', emoji: '🇬🇭' },
]

const scrollToSection = (id) => {
  const el = document.querySelector(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

const quoteLines = [
  ["LIVE", "RIGHT."], ["STRIDE", "HARD."],
  ["THE", "SCIENCE", "OF", "BEING", "ACTIVE"],
  ["IS", "THE", "ART", "OF", "SURVIVAL."]
]
</script>

<template>
  <div class="bg-runblack text-white selection:bg-rungreen selection:text-black min-h-screen font-['Urbanist',_sans-serif]">
    
    <section id="hero" class="relative h-screen flex items-center overflow-hidden">
      <div class="absolute inset-0 z-0">
        <div class="absolute inset-0 bg-gradient-to-b from-runblack/40 via-runblack/60 to-runblack z-10"></div>
        <img src="/images/athletes-jogging.jpg" class="w-full h-full object-cover scale-110 opacity-60" />
      </div>
      <div class="container mx-auto px-5 sm:px-6 max-w-6xl relative z-20">
        <div :class="['transition-all duration-1000 transform', visibleSections.has('hero') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20']">
          <h1 class="text-[clamp(3.5rem,13vw,11rem)] font-black italic uppercase tracking-tighter leading-[0.85] mb-8 font-['Poppins']">
            Always <br /> <span class="text-rungreen text-shadow-glow text-left">Moving.</span>
          </h1>
          <p class="text-gray-200 text-base sm:text-lg md:text-2xl italic font-black max-w-2xl mb-14 border-l-4 md:border-l-8 border-rungreen pl-5 md:pl-8 leading-tight">
            "Being on the go isn't just a habit; it's a state of being. We optimize your momentum."
          </p>
          <button @click="scrollToSection('#science')" class="group px-8 sm:px-14 py-4 sm:py-6 bg-white/5 border border-white/20 rounded-3xl hover:bg-rungreen hover:text-black transition-all duration-500">
            <span class="font-black uppercase italic text-xs sm:text-sm tracking-widest">EXPLORE INVENTORY</span>
          </button>
        </div>
      </div>
    </section>

    <div class="bg-rungreen/10 border-y border-rungreen/20 py-5 overflow-hidden">
      <div class="trust-marquee whitespace-nowrap">
        <span v-for="n in 4" :key="'tb1-'+n" class="inline-block">
          <span v-for="item in trustItems1" :key="item.text + n" class="inline-block mx-8 text-[12px] font-black uppercase tracking-[0.25em] text-rungreen">
            {{ item.emoji }} {{ item.text }}
          </span>
        </span>
      </div>
    </div>

    <div class="container mx-auto px-5 sm:px-6 max-w-6xl">
      <section id="science" class="py-24 sm:py-44 scroll-mt-20">
        <div class="mb-16 text-left">
          <h3 class="text-rungreen font-black tracking-[0.4em] uppercase text-[11px] mb-4">Protocol</h3>
          <h2 class="text-[clamp(2.2rem,6vw,4rem)] font-black italic uppercase tracking-tighter font-['Poppins']">The Performance <span class="text-white/30">System.</span></h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10">
          <div v-for="(item, i) in [
            {icon: 'ph:bowl-food-bold', title: '1. Fuel Up', desc: 'Strategically time your intake with natural nutrition designed to prevent fatigue.'},
            {icon: 'ph:sneaker-move-bold', title: '2. Stride Well', desc: 'Precision-engineered gear with targeted tension zones for oxygenation.'},
            {icon: 'ph:shield-check-bold', title: '3. Fast Repair', desc: 'Clinical herbal protocols that address inflammation at the source.'}
          ]" :key="i" class="glass-card-deep p-8 sm:p-12 rounded-[40px] md:rounded-[60px] border border-white/10 relative overflow-hidden group text-left">
            <Icon :name="item.icon" class="text-rungreen text-5xl md:text-6xl mb-8 group-hover:scale-110 transition-transform" />
            <h4 class="font-black italic uppercase text-2xl md:text-3xl mb-4 font-['Poppins'] text-white leading-none">{{item.title}}</h4>
            <p class="text-gray-400 text-sm md:text-base font-bold italic leading-snug">{{item.desc}}</p>
          </div>
        </div>
      </section>

      <section id="categories" class="py-24 sm:py-44 scroll-mt-20">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20 text-left">
          <div class="space-y-4">
              <h3 class="text-rungreen font-black tracking-[0.4em] uppercase text-[11px]">The Collection</h3>
              <h2 class="text-[clamp(2.2rem,6vw,4rem)] font-black italic uppercase tracking-tighter font-['Poppins']">Shop By <span class="text-white/30">System.</span></h2>
          </div>
          <NuxtLink to="/categories" class="group flex items-center gap-4 px-8 py-4 bg-white/5 border border-white/10 rounded-full hover:bg-rungreen hover:text-black transition-all">
              <span class="font-black uppercase italic text-[10px] tracking-widest">See All Categories</span>
              <Icon name="ph:arrow-right-bold" class="text-lg group-hover:translate-x-2 transition-transform" />
          </NuxtLink>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="(cat, i) in categories" :key="i" 
               class="glass-card-deep p-8 sm:p-12 rounded-[40px] border border-white/5 flex flex-col group relative min-h-[380px] md:min-h-[480px] transition-all hover:border-rungreen/40 text-left">
            <div class="mb-12 transition-colors duration-500 text-white/10 group-hover:text-rungreen">
              <Icon :name="cat.icon" class="text-7xl md:text-8xl" />
            </div>
            <div>
              <div class="text-[10px] font-black text-rungreen mb-4 tracking-[0.5em] uppercase opacity-50 italic">SYS.0{{i+1}}</div>
              <h4 class="text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-none font-['Poppins'] text-white">{{ cat.name }}</h4>
            </div>
            <div class="mt-auto pt-10 border-t border-white/5 w-full">
              <span class="text-xs font-black uppercase tracking-widest text-rungreen italic block mb-3">{{ cat.sub }}</span>
              <p class="text-xs md:text-sm text-gray-500 font-bold italic leading-relaxed group-hover:text-gray-300">{{ cat.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="available" class="py-24 sm:py-44 scroll-mt-20">
        <div class="mb-16 text-left">
          <h3 class="text-rungreen font-black tracking-[0.4em] uppercase text-[11px] mb-4">Stock Report</h3>
          <h2 class="text-[clamp(2.2rem,6vw,4rem)] font-black italic uppercase tracking-tighter font-['Poppins']">Ready for <span class="text-white/30">Deployment.</span></h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10 text-left">
          <NuxtLink v-for="i in 2" :key="i" to="/products/1" class="glass-card-deep rounded-[40px] md:rounded-[60px] p-8 md:p-10 border border-white/5 group hover:border-rungreen/40 transition-all">
            <div class="aspect-[4/3] rounded-[30px] md:rounded-[40px] bg-white/[0.02] mb-10 overflow-hidden relative flex items-center justify-center border border-white/5">
              <div class="absolute top-6 left-6 bg-rungreen text-black text-[9px] font-black px-4 py-2 uppercase rounded-md z-10">In Circuit</div>
              <Icon name="ph:sneaker-move-bold" class="text-white/5 text-[10rem] md:text-[15rem] group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div class="flex justify-between items-center px-2">
              <div class="space-y-1">
                <h4 class="text-3xl md:text-5xl font-black italic uppercase tracking-tighter group-hover:text-rungreen transition-colors font-['Poppins'] leading-none text-white">V.0{{i}} Jogger</h4>
                <p class="text-rungreen font-black text-xl md:text-3xl tracking-tighter italic">GHS 450.00</p>
              </div>
              <div class="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/10 group-hover:bg-rungreen group-hover:text-black flex items-center justify-center transition-all">
                <Icon name="ph:arrow-right-bold" class="text-2xl" />
              </div>
            </div>
          </NuxtLink>
        </div>
      </section>

      <section id="consultation" class="py-24 sm:py-44 scroll-mt-20">
        <div class="glass-card-deep rounded-[50px] md:rounded-[80px] p-8 md:p-24 border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center overflow-hidden relative text-left">
          <div class="space-y-10 relative z-10">
            <h2 class="font-['Poppins'] italic uppercase tracking-tighter leading-[0.8] text-white">
              <span class="text-2xl md:text-5xl block mb-4 md:mb-6 font-black text-white/40 italic">Attain Healthy</span>
              <span class="text-[clamp(3.5rem,10vw,8rem)] text-rungreen block leading-none">Living.</span>
            </h2>
            <p class="text-white text-base md:text-xl italic font-black leading-snug border-l-4 border-rungreen pl-6 md:pl-8">
                Bridge modern fitness with herbal wisdom. Our clinical sessions optimize your natural balance through botanical strategy.
            </p>
          </div>
          <div class="md:border-l border-white/10 md:pl-20 space-y-8 md:space-y-12 relative z-10">
            <div class="space-y-6">
                <h3 class="text-white text-3xl md:text-4xl font-black uppercase italic tracking-tighter font-['Poppins'] leading-none">Book a <br/> Consultation</h3>
                <p class="text-gray-500 font-bold italic text-lg md:text-xl leading-tight">Secure your spot in the Accra Active performance circuit today.</p>
            </div>
            <button @click="orderOnWhatsApp('Consultation Inquiry', 'N/A')" class="btn-global w-full bg-rungreen text-black py-6 md:py-8 rounded-[30px] md:rounded-[40px] font-black uppercase italic text-lg md:text-2xl flex justify-center items-center gap-4 md:gap-6">
              INITIATE NOW <Icon name="ph:calendar-check-bold" class="text-3xl md:text-4xl" />
            </button>
          </div>
        </div>
      </section>
    </div>

    <div class="bg-rungreen/10 border-y border-rungreen/20 py-5 overflow-hidden mt-20">
      <div class="trust-marquee-reverse whitespace-nowrap">
        <span v-for="n in 4" :key="'tb2-'+n" class="inline-block">
          <span v-for="item in trustItems2" :key="item.text + n" class="inline-block mx-8 text-[12px] font-black uppercase tracking-[0.25em] text-rungreen/70">
            {{ item.emoji }} {{ item.text }}
          </span>
        </span>
      </div>
    </div>

    <div class="container mx-auto px-5 sm:px-6 max-w-6xl">
      <section id="quote" class="py-32 md:py-48 text-center scroll-mt-20">
        <h2 class="text-[clamp(1.5rem,5vw,5rem)] font-black italic uppercase tracking-tighter leading-[1.1] max-w-6xl mx-auto font-['Poppins']">
          <div v-for="(line, lIndex) in quoteLines" :key="lIndex" class="mb-4">
            <span v-for="(word, wIndex) in line" :key="wIndex" class="inline-block mx-1 md:mx-3 transition-all hover:text-rungreen" :class="word === 'HARD.' || word === 'ACTIVE' ? 'text-rungreen' : 'text-white'">
              {{ word }}
            </span>
          </div>
        </h2>
      </section>

      <footer class="pt-24 md:pt-40 pb-16 border-t border-white/10 text-left">
        <div class="grid md:grid-cols-12 gap-12 mb-20 md:mb-32">
          <div class="md:col-span-6 space-y-8 md:space-y-12">
            <div>
              <div class="text-[10px] font-black text-rungreen tracking-[0.6em] uppercase mb-4 opacity-60">Origin_Protocol</div>
              <div class="text-5xl md:text-7xl font-black italic tracking-tighter uppercase font-['Poppins'] text-white leading-none">RUN<span class="text-rungreen">GO</span>RUN</div>
            </div>
            <p class="text-gray-400 font-bold italic text-lg md:text-2xl leading-[1.1] max-w-xl">
              Movement is a clinical science. Our systems are engineered at the intersection of physical limits and botanical strategy.
            </p>
          </div>
          <div class="md:col-span-3 space-y-8 md:space-y-10">
            <h5 class="text-rungreen font-black uppercase text-[10px] tracking-[0.5em] italic border-b border-white/5 pb-4">Internal_Links</h5>
            <ul class="space-y-4 md:space-y-6">
              <li v-for="l in [{n:'The Collection', id:'#categories'}, {n:'Protocol', id:'#science'}]" :key="l.n" @click="scrollToSection(l.id)" class="group cursor-pointer flex items-center gap-3">
                <div class="h-1 w-0 bg-rungreen group-hover:w-4 transition-all"></div>
                <span class="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-white">{{l.n}}</span>
              </li>
            </ul>
          </div>
          <div class="md:col-span-3 space-y-8 md:space-y-10">
            <h5 class="text-rungreen font-black uppercase text-[10px] tracking-[0.5em] italic border-b border-white/5 pb-4">Concierge</h5>
            <button @click="showContact = true" class="group flex flex-col items-start gap-2">
              <span class="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-rungreen">Support Terminal</span>
              <span class="text-xl md:text-2xl font-black italic uppercase text-white font-['Poppins']">Open Link</span>
            </button>
          </div>
        </div>
        <div class="flex flex-col md:flex-row justify-between items-center border-t border-white/5 pt-10 gap-8">
          <div class="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-gray-700 text-center md:text-left">© 2026 RUN GO RUN. ALL RIGHTS OPTIMIZED.</div>
          <Icon name="ph:barcode-bold" class="text-4xl md:text-5xl text-white/10" />
        </div>
      </footer>
    </div>

    <div v-if="showContact" class="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-black/98 backdrop-blur-3xl">
      <div class="glass-card-deep w-full max-w-2xl rounded-[40px] md:rounded-[60px] border border-white/20 relative bg-[#080808] overflow-hidden text-left">
        <button @click="showContact = false" class="absolute top-6 right-6 md:top-10 md:right-10 text-white/20 hover:text-white transition-all duration-700 hover:rotate-[360deg] z-[200]">
          <Icon name="ph:x-circle-bold" class="text-4xl md:text-6xl" />
        </button>
        <div class="p-8 md:p-20 space-y-8 md:space-y-12 relative z-10">
          <div class="space-y-6">
            <h3 class="text-rungreen font-black italic uppercase text-xs tracking-[0.5em]">Concierge Strategy</h3>
            <p class="text-3xl md:text-5xl text-white font-black italic leading-[0.9] tracking-tighter uppercase font-['Poppins']">
              Your problems <br/> are not really <br/> <span class="text-rungreen">problems.</span>
            </p>
          </div>
          <button @click="orderOnWhatsApp('General Inquiry', 'N/A')" class="btn-global w-full bg-rungreen text-black py-6 md:py-9 rounded-[30px] md:rounded-[40px] font-black uppercase italic text-base md:text-xl flex justify-center items-center gap-4 md:gap-6">
            INITIATE CONVERSATION <Icon name="ph:whatsapp-logo-fill" class="text-3xl md:text-4xl" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@1,900&family=Urbanist:ital,wght@0,300;0,400;0,700;0,900;1,300;1,700;1,900&display=swap');

.glass-card-deep { background: linear-gradient(160deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%); backdrop-filter: blur(80px); }
.text-shadow-glow { text-shadow: 0 0 60px rgba(223, 255, 0, 0.45); }

/* RESTORED MARQUEE ANIMATIONS */
.trust-marquee { display: inline-block; animation: marquee-scroll 40s linear infinite; }
.trust-marquee-reverse { display: inline-block; animation: marquee-scroll 50s linear infinite reverse; }

@keyframes marquee-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-25%); }
}

@keyframes pulse-global { 
  0% { box-shadow: 0 0 0 0 rgba(223, 255, 0, 0.6); } 
  70% { box-shadow: 0 0 0 30px rgba(223, 255, 0, 0); } 
  100% { box-shadow: 0 0 0 0 rgba(223, 255, 0, 0); } 
}
.btn-global { animation: pulse-global 2s infinite; }
html { scroll-behavior: smooth; background: #000; }
</style>