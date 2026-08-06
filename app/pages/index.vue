<script setup>
import { useWhatsApp } from "~/composables/useWhatsApp";
import { products } from "~/data/products";
import { SITE_NAME, SITE_URL, DEFAULT_DESCRIPTION } from "~/utils/seo";

const { orderOnWhatsApp } = useWhatsApp();
const visibleSections = ref(new Set());

useHead({
  link: [{ rel: "canonical", href: SITE_URL }],
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/apple-touch-icon.png`,
        description: DEFAULT_DESCRIPTION,
        areaServed: {
          "@type": "City",
          name: "Accra",
        },
      }),
    },
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
      }),
    },
  ],
});

const featuredProducts = computed(() => products.slice(-2).reverse());
const showContact = useState("contact_modal");

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleSections.value.add(entry.target.id);
      });
    },
    { threshold: 0.4 },
  );
  document
    .querySelectorAll("section, .observe")
    .forEach((s) => observer.observe(s));
});

const categories = [
  {
    name: "Apparel",
    sub: "The Run Kits",
    desc: "Engineering the perfect run kit for the Accra climate.",
    icon: "ph:t-shirt-bold",
  },
  {
    name: "Access -ories",
    sub: "The Move Gear",
    desc: "Strategic gear for the mobile athlete and hydration.",
    icon: "ph:backpack-bold",
  },
  {
    name: "Support",
    sub: "Recovery Lab",
    desc: "Scientific recovery systems and herbal topicals.",
    icon: "ph:first-aid-kit-bold",
  },
  {
    name: "Metric Tech",
    sub: "Vitals",
    desc: "Data-driven results and smart sensors for tracking.",
    icon: "ph:cpu-bold",
  },
];

const trustItems1 = [
  { text: "Fast Local Delivery", emoji: "🚀" },
  { text: "WhatsApp Ordering", emoji: "💬" },
  { text: "Premium Quality", emoji: "⭐" },
  { text: "Sweat-Proof Gear", emoji: "💪" },
  { text: "Herballo Wellness Partner", emoji: "🌿" },
  { text: "No Pain No Gain", emoji: "🔥" },
  { text: "Accra Fast Delivery", emoji: "📦" },
  { text: "Built For Runners", emoji: "🏃" },
];

const trustItems2 = [
  { text: "Run Go Run", emoji: "🏃" },
  { text: "Herballo Health Tips", emoji: "🌿" },
  { text: "Healthy Living", emoji: "💚" },
  { text: "Movement Is Medicine", emoji: "🩺" },
  { text: "Free Tip Card In Every Order", emoji: "🎁" },
  { text: "Book A Consultation", emoji: "📅" },
  { text: "Active Lifestyle", emoji: "⚡" },
  { text: "Accra Ghana", emoji: "🇬🇭" },
];

const testimonials = [
  {
    name: "Abena K.",
    location: "East Legon, Accra",
    text: "The running vest is everything. I wore it for my morning jog and it held up perfectly in the heat. Ordered on WhatsApp and it arrived the same day.",
    tag: "Verified Buyer",
  },
  {
    name: "Kofi M.",
    location: "Tema, Accra",
    text: "I was skeptical about ordering through WhatsApp but it was the smoothest experience. The armband fits perfectly and my phone hasn't slipped once.",
    tag: "Verified Buyer",
  },
  {
    name: "Ama S.",
    location: "Kasoa",
    text: "Finally a brand that gets us. The gear is built for our weather, our roads, our lifestyle. Run Go Run is the real deal.",
    tag: "Verified Buyer",
  },
];

const scrollToSection = (id) => {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};
</script>

<template>
  <div
    class="bg-runblack text-white selection:bg-rungreen selection:text-black min-h-screen font-['Urbanist',_sans-serif]"
  >
    <!-- ── HERO ── -->
    <section
      id="hero"
      class="relative h-screen flex items-center overflow-hidden bg-runblack"
    >
      <div class="absolute inset-0 z-0">
        <div
          class="absolute inset-0 bg-gradient-to-b from-runblack/40 via-runblack/60 to-runblack z-10"
        ></div>
        <img
          src="/images/athletes-jogging.jpg"
          class="w-full h-full object-cover scale-110 opacity-60 pointer-events-none"
          alt="Run Go Run Performance"
          loading="eager"
          fetchpriority="high"
        />
      </div>
      <div class="container mx-auto px-5 sm:px-6 max-w-6xl relative z-20">
        <div
          :class="[
            'transition-all duration-1000 transform',
            visibleSections.has('hero')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-20',
          ]"
        >
          <h1
            class="text-[clamp(3.5rem,13vw,11rem)] font-black italic uppercase tracking-tighter leading-[0.85] mb-8 font-['Poppins']"
          >
            Always <br />
            <span class="text-rungreen text-shadow-glow text-left"
              >Moving.</span
            >
          </h1>
          <p
            class="text-gray-200 text-base sm:text-lg md:text-2xl italic font-black max-w-2xl mb-14 border-l-4 md:border-l-8 border-rungreen pl-5 md:pl-8 leading-tight"
          >
            "Being on the go isn't just a habit; it's a state of being. We
            optimize your momentum."
          </p>
          <button
            @click="scrollToSection('#available')"
            class="group px-8 sm:px-14 py-4 sm:py-6 bg-white/5 border border-white/20 rounded-3xl hover:bg-rungreen hover:text-black transition-all duration-500"
          >
            <span
              class="font-black uppercase italic text-xs sm:text-sm tracking-widest"
              >EXPLORE PRODUCTS</span
            >
          </button>
        </div>
      </div>
    </section>

    <!-- ── MARQUEE 1 ── -->
    <div
      class="bg-rungreen/10 border-y border-rungreen/20 py-5 overflow-hidden"
    >
      <div class="trust-marquee whitespace-nowrap">
        <span v-for="n in 4" :key="'tb1-' + n" class="inline-block">
          <span
            v-for="item in trustItems1"
            :key="item.text + n"
            class="inline-block mx-8 text-[12px] font-black uppercase tracking-[0.25em] text-rungreen"
          >
            {{ item.emoji }} {{ item.text }}
          </span>
        </span>
      </div>
    </div>

    <div class="container mx-auto px-5 sm:px-6 max-w-6xl">
      <!-- ── AVAILABLE PRODUCTS ── -->
      <section id="available" class="py-24 sm:py-44 scroll-mt-32">
        <div class="mb-16 text-left">
          <h3
            class="text-rungreen font-black tracking-[0.4em] uppercase text-[11px] mb-4"
          >
            Stock Report
          </h3>
          <h2
            class="text-[clamp(2.2rem,6vw,4rem)] font-black italic uppercase tracking-tighter font-['Poppins']"
          >
            Ready for <span class="text-white/30">Deployment.</span>
          </h2>
        </div>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10 text-left mb-16"
        >
          <NuxtLink
            v-for="(product, i) in featuredProducts"
            :key="product.id"
            :to="`/products/${product.id}`"
            :class="[
              'glass-card-deep rounded-[40px] md:rounded-[60px] p-8 md:p-10 border border-white/5 group hover:border-rungreen/40 transition-all card-animate',
              visibleSections.has('available') ? 'card-visible' : '',
            ]"
            :style="`--delay: ${i * 120}ms`"
          >
            <div
              class="aspect-[4/3] rounded-[30px] md:rounded-[40px] bg-white/[0.02] mb-10 overflow-hidden relative flex items-center justify-center border border-white/5"
            >
              <div
                class="absolute top-6 left-6 bg-rungreen text-black text-[9px] font-black px-4 py-2 uppercase rounded-md z-10"
              >
                In Circuit
              </div>
              <img
                v-if="product.images && product.images[0]"
                :src="product.images[0]"
                :alt="product.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <Icon
                v-else
                name="ph:sneaker-move-bold"
                class="text-white/5 text-[10rem] md:text-[15rem] group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div class="flex justify-between items-center px-2">
              <div class="space-y-1">
                <h4
                  class="text-3xl md:text-5xl font-black italic uppercase tracking-tighter group-hover:text-rungreen transition-colors font-['Poppins'] leading-none text-white"
                >
                  {{ product.name }}
                </h4>
                <p
                  class="text-rungreen font-black text-xl md:text-3xl tracking-tighter italic"
                >
                  GHS {{ product.price }}
                </p>
              </div>
              <div
                class="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/10 group-hover:bg-rungreen group-hover:text-black flex items-center justify-center transition-all"
              >
                <Icon name="ph:arrow-right-bold" class="text-2xl" />
              </div>
            </div>
          </NuxtLink>
        </div>
        <div class="flex justify-center md:justify-start">
          <NuxtLink
            to="/categories"
            class="group flex items-center gap-6 px-10 py-5 bg-rungreen/5 border border-rungreen/20 rounded-full hover:bg-rungreen hover:text-black transition-all duration-500"
          >
            <span class="font-black uppercase italic text-xs tracking-[0.3em]"
              >Browse Full Inventory</span
            >
            <Icon
              name="ph:caret-double-right-bold"
              class="text-xl group-hover:translate-x-2 transition-transform"
            />
          </NuxtLink>
        </div>
      </section>
    </div>

    <!-- ── LIFESTYLE IMAGE BANNER ── -->
    <div
      class="w-full overflow-hidden relative observe"
      id="lifestyle-banner"
      :class="
        visibleSections.has('lifestyle-banner')
          ? 'banner-visible'
          : 'banner-hidden'
      "
      style="height: 75vh"
    >
      <div
        class="absolute inset-0 bg-gradient-to-r from-runblack via-transparent to-runblack z-10"
      ></div>
      <div
        class="absolute inset-0 bg-gradient-to-b from-runblack/30 to-runblack/60 z-10"
      ></div>
      <img
        src="/images/homecouplerun.jpg"
        alt="Run Go Run Community"
        class="w-full h-full object-cover object-top"
      />
      <div class="absolute inset-0 z-20 flex items-center">
        <div class="container mx-auto px-5 sm:px-6 max-w-6xl">
          <p
            class="text-[10px] font-black uppercase tracking-[0.4em] text-rungreen mb-4 italic"
          >
            The Circuit Is Live
          </p>
          <h2
            class="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-none font-['Poppins'] text-white max-w-2xl"
          >
            Gear Up. <br />
            <span class="text-rungreen">Show Up.</span>
          </h2>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-5 sm:px-6 max-w-6xl">
      <!-- ── CATEGORIES SECTION ── -->
      <section id="categories" class="py-24 sm:py-44 scroll-mt-48">
        <div
          class="flex flex-row justify-between items-center gap-8 mb-20 text-left"
        >
          <div class="space-y-4">
            <h3
              class="text-rungreen font-black tracking-[0.4em] uppercase text-[11px]"
            >
              The Collection
            </h3>
            <h2
              class="text-[clamp(2.2rem,6vw,4rem)] font-black italic uppercase tracking-tighter font-['Poppins'] leading-none"
            >
              Shop By <span class="text-white/30">System.</span>
            </h2>
          </div>
          <NuxtLink
            to="/categories"
            class="group flex items-center gap-4 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-rungreen hover:text-black transition-all duration-500 whitespace-nowrap"
          >
            <span
              class="font-black uppercase italic text-[10px] md:text-[11px] tracking-widest"
              >Check Inventory</span
            >
            <Icon
              name="ph:caret-double-right-bold"
              class="text-lg group-hover:translate-x-2 transition-transform"
            />
          </NuxtLink>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="(cat, i) in categories"
            :key="i"
            :class="[
              'glass-card-deep p-8 sm:p-12 rounded-[40px] border border-white/5 flex flex-col group relative min-h-[380px] md:min-h-[480px] transition-all hover:border-rungreen/40 text-left card-animate',
              visibleSections.has('categories') ? 'card-visible' : '',
            ]"
            :style="`--delay: ${i * 100}ms`"
          >
            <div
              class="mb-12 transition-colors duration-500 text-white/10 group-hover:text-rungreen"
            >
              <Icon :name="cat.icon" class="text-7xl md:text-8xl" />
            </div>
            <div>
              <div
                class="text-[10px] font-black text-rungreen mb-4 tracking-[0.5em] uppercase opacity-50 italic"
              >
                SYS.0{{ i + 1 }}
              </div>
              <h4
                class="text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-none font-['Poppins'] text-white"
              >
                {{ cat.name }}
              </h4>
            </div>
            <div class="mt-auto pt-10 border-t border-white/5 w-full">
              <span
                class="text-xs font-black uppercase tracking-widest text-rungreen italic block mb-3"
                >{{ cat.sub }}</span
              >
              <p
                class="text-xs md:text-sm text-gray-500 font-bold italic leading-relaxed group-hover:text-gray-300"
              >
                {{ cat.desc }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ── HOW IT WORKS ── -->
      <section id="how-it-works" class="py-24 sm:py-44 scroll-mt-32">
        <div class="mb-16 text-left">
          <h3
            class="text-rungreen font-black tracking-[0.4em] uppercase text-[11px] mb-4"
          >
            The Process
          </h3>
          <h2
            class="text-[clamp(2.2rem,6vw,4rem)] font-black italic uppercase tracking-tighter font-['Poppins']"
          >
            How It <span class="text-white/30">Works.</span>
          </h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10">
          <div
            v-for="(step, i) in [
              {
                icon: 'ph:magnifying-glass-bold',
                title: '01. Browse',
                desc: 'Explore the inventory and find the gear built for your active lifestyle. Every product is tested for the Accra climate.',
              },
              {
                icon: 'ph:whatsapp-logo-bold',
                title: '02. Order on WhatsApp',
                desc: 'Tap Deploy Order on any product. A pre-filled WhatsApp message is sent straight to us — no forms, no checkout, no stress.',
              },
              {
                icon: 'ph:package-bold',
                title: '03. We Deliver',
                desc: 'Sit back. Your gear is confirmed, packed, and on its way to you fast. We keep you updated every step of the way.',
              },
            ]"
            :key="i"
            :class="[
              'angle-glow-card p-8 sm:p-12 rounded-[40px] md:rounded-[60px] border border-white/10 relative overflow-hidden group text-left card-animate',
              visibleSections.has('how-it-works') ? 'card-visible' : '',
            ]"
            :style="`--delay: ${i * 120}ms`"
          >
            <Icon
              :name="step.icon"
              class="text-rungreen text-5xl md:text-6xl mb-8 group-hover:scale-110 transition-transform"
            />
            <h4
              class="font-black italic uppercase text-2xl md:text-3xl mb-4 font-['Poppins'] text-white leading-none"
            >
              {{ step.title }}
            </h4>
            <p
              class="text-gray-400 text-sm md:text-base font-bold italic leading-snug"
            >
              {{ step.desc }}
            </p>
          </div>
        </div>
      </section>

      <!-- ── TESTIMONIALS ── -->
      <section id="testimonials" class="py-24 sm:py-44 scroll-mt-32">
        <div class="mb-16 text-left">
          <h3
            class="text-rungreen font-black tracking-[0.4em] uppercase text-[11px] mb-4"
          >
            The Circuit Speaks
          </h3>
          <h2
            class="text-[clamp(2.2rem,6vw,4rem)] font-black italic uppercase tracking-tighter font-['Poppins']"
          >
            What They're <span class="text-white/30">Saying.</span>
          </h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
          <div
            v-for="(t, i) in testimonials"
            :key="i"
            :class="[
              'glass-card-deep p-8 rounded-[40px] border border-white/5 flex flex-col gap-6 hover:border-rungreen/30 transition-all text-left card-animate',
              visibleSections.has('testimonials') ? 'card-visible' : '',
            ]"
            :style="`--delay: ${i * 120}ms`"
          >
            <div class="flex items-center gap-2">
              <span v-for="s in 5" :key="s" class="text-rungreen text-sm"
                >★</span
              >
            </div>
            <p
              class="text-gray-300 font-bold italic text-base leading-relaxed flex-1"
            >
              "{{ t.text }}"
            </p>
            <div
              class="border-t border-white/5 pt-4 flex justify-between items-center"
            >
              <div>
                <p
                  class="text-white font-black uppercase tracking-tighter text-sm"
                >
                  {{ t.name }}
                </p>
                <p class="text-gray-500 font-bold text-xs italic">
                  {{ t.location }}
                </p>
              </div>
              <span
                class="text-[9px] font-black uppercase tracking-widest text-rungreen border border-rungreen/30 px-3 py-1 rounded-full"
                >{{ t.tag }}</span
              >
            </div>
          </div>
        </div>
      </section>

      <!-- ── PROTOCOL SECTION ── -->
      <section id="science" class="py-24 sm:py-44 scroll-mt-32">
        <div class="mb-16 text-left">
          <h3
            class="text-rungreen font-black tracking-[0.4em] uppercase text-[11px] mb-4"
          >
            Protocol
          </h3>
          <h2
            class="text-[clamp(2.2rem,6vw,4rem)] font-black italic uppercase tracking-tighter font-['Poppins']"
          >
            The Performance <span class="text-white/30">System.</span>
          </h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10">
          <div
            v-for="(item, i) in [
              {
                icon: 'ph:bowl-food-bold',
                title: '1. Fuel Up',
                desc: 'Strategically time your intake with natural nutrition designed to prevent fatigue.',
              },
              {
                icon: 'ph:sneaker-move-bold',
                title: '2. Stride Well',
                desc: 'Precision-engineered gear with targeted tension zones for oxygenation.',
              },
              {
                icon: 'ph:shield-check-bold',
                title: '3. Fast Repair',
                desc: 'Clinical herbal protocols that address inflammation at the source.',
              },
            ]"
            :key="i"
            :class="[
              'angle-glow-card p-8 sm:p-12 rounded-[40px] md:rounded-[60px] border border-white/10 relative overflow-hidden group text-left card-animate',
              visibleSections.has('science') ? 'card-visible' : '',
            ]"
            :style="`--delay: ${i * 120}ms`"
          >
            <Icon
              :name="item.icon"
              class="text-rungreen text-5xl md:text-6xl mb-8 group-hover:scale-110 transition-transform"
            />
            <h4
              class="font-black italic uppercase text-2xl md:text-3xl mb-4 font-['Poppins'] text-white leading-none"
            >
              {{ item.title }}
            </h4>
            <p
              class="text-gray-400 text-sm md:text-base font-bold italic leading-snug"
            >
              {{ item.desc }}
            </p>
          </div>
        </div>
      </section>

      <!-- ── CONSULTATION SECTION ── -->
      <section id="consultation" class="py-24 sm:py-44 scroll-mt-32">
        <div
          class="angle-glow-card rounded-[50px] md:rounded-[80px] p-8 md:p-24 border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center overflow-hidden relative text-left"
        >
          <div class="space-y-10 relative z-10">
            <h2
              class="font-['Poppins'] italic uppercase tracking-tighter leading-[0.8] text-white"
            >
              <span
                class="text-2xl md:text-5xl block mb-4 md:mb-6 font-black text-white/40 italic"
                >Attain Healthy</span
              >
              <span
                class="text-[clamp(3.5rem,10vw,8rem)] text-rungreen block leading-none"
                >Living.</span
              >
            </h2>
            <p
              class="text-white text-base md:text-xl italic font-black leading-snug border-l-4 border-rungreen pl-6 md:pl-8"
            >
              Bridge modern fitness with herbal wisdom. Our clinical sessions
              optimize your natural balance through botanical strategy.
            </p>
          </div>
          <div
            class="md:border-l border-white/10 md:pl-20 space-y-8 md:space-y-12 relative z-10"
          >
            <div class="space-y-6">
              <h3
                class="text-white text-3xl md:text-4xl font-black uppercase italic tracking-tighter font-['Poppins'] leading-none"
              >
                Book a <br />
                Consultation
              </h3>
              <p
                class="text-gray-500 font-bold italic text-lg md:text-xl leading-tight"
              >
                Secure your spot in the Accra Active performance circuit today.
              </p>
            </div>
            <a href="https://www.herballo.co/consultation" target="_blank" rel="noopener noreferrer" class="btn-global w-full bg-rungreen text-black py-6 md:py-8 rounded-[30px] md:rounded-[40px] font-black uppercase italic text-lg md:text-2xl flex justify-center items-center gap-4 md:gap-6">
  INITIATE NOW <Icon name="ph:calendar-check-bold" class="text-3xl md:text-4xl" />
</a>
          </div>
        </div>
      </section>
    </div>

    <!-- ── MARQUEE 2 ── -->
    <div
      class="bg-rungreen/10 border-y border-rungreen/20 py-5 overflow-hidden mt-20"
    >
      <div class="trust-marquee-reverse whitespace-nowrap">
        <span v-for="n in 4" :key="'tb2-' + n" class="inline-block">
          <span
            v-for="item in trustItems2"
            :key="item.text + n"
            class="inline-block mx-8 text-[12px] font-black uppercase tracking-[0.25em] text-rungreen/70"
          >
            {{ item.emoji }} {{ item.text }}
          </span>
        </span>
      </div>
    </div>

    <SubscribeBox source="home" />
  </div>
</template>

<style>
.glass-card-deep {
  background: linear-gradient(
    160deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.01) 100%
  );
  backdrop-filter: blur(80px);
}
.text-shadow-glow {
  text-shadow: 0 0 60px rgba(223, 255, 0, 0.45);
}

.angle-glow-card {
  position: relative;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(80px);
  background-image:
    radial-gradient(
      circle at top left,
      rgba(223, 255, 0, 0.12) 0%,
      transparent 40%
    ),
    radial-gradient(
      circle at bottom right,
      rgba(223, 255, 0, 0.12) 0%,
      transparent 40%
    );
}

.angle-glow-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.5px;
  background: linear-gradient(
    135deg,
    rgba(223, 255, 0, 0.4) 0%,
    rgba(255, 255, 255, 0.05) 20%,
    rgba(255, 255, 255, 0.05) 80%,
    rgba(223, 255, 0, 0.4) 100%
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
}

/* ── CARD ANIMATIONS ── */
.card-animate {
  opacity: 0;
  transform: translateY(90px) rotate(-3deg) scale(0.95);
  transition:
    opacity 0.65s ease,
    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--delay, 0ms);
}

.card-visible {
  opacity: 1;
  transform: translateY(0) rotate(0deg) scale(1);
}

/* ── LIFESTYLE BANNER FADE ── */
.banner-hidden {
  opacity: 0;
  transform: scale(1.03);
  transition:
    opacity 1.4s ease,
    transform 1.4s ease;
}

.banner-visible {
  opacity: 1;
  transform: scale(1);
  transition:
    opacity 1.4s ease,
    transform 1.4s ease;
}

.trust-marquee {
  display: inline-block;
  animation: marquee-scroll 40s linear infinite;
}
.trust-marquee-reverse {
  display: inline-block;
  animation: marquee-scroll 50s linear infinite reverse;
}

@keyframes marquee-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-25%);
  }
}

@keyframes pulse-global {
  0% {
    box-shadow: 0 0 0 0 rgba(223, 255, 0, 0.6);
  }
  70% {
    box-shadow: 0 0 0 30px rgba(223, 255, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(223, 255, 0, 0);
  }
}
.btn-global {
  animation: pulse-global 2s infinite;
}
</style>
