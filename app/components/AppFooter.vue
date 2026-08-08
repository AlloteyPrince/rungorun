<script setup>
const showContact = useState("contact_modal");
const router = useRouter();
const route = useRoute();

const { data: siteSettings } = useSiteSettings();
const socialLinks = computed(() =>
  [
    { url: siteSettings.value.instagram_url, icon: "ph:instagram-logo-bold", label: "Instagram" },
    { url: siteSettings.value.facebook_url, icon: "ph:facebook-logo-bold", label: "Facebook" },
    { url: siteSettings.value.tiktok_url, icon: "ph:tiktok-logo-bold", label: "TikTok" },
  ].filter((s) => s.url)
);

const handleFooterLink = async (path) => {
  if (path.startsWith("#")) {
    if (route.path === "/") {
      const el = document.querySelector(path);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      await router.push("/");
      setTimeout(() => {
        const el = document.querySelector(path);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  } else {
    await router.push(path);
  }
};
</script>

<template>
  <div class="container mx-auto px-5 sm:px-6 max-w-6xl">
    <footer class="pt-24 md:pt-40 pb-16 border-t border-white/10 text-left">
      <div class="grid md:grid-cols-12 gap-12 mb-20 md:mb-32">
        <div class="md:col-span-6 space-y-8 md:space-y-12">
          <div>
            <div
              class="text-[10px] font-black text-rungreen tracking-[0.6em] uppercase mb-4 opacity-60"
            >
              Origin_Protocol
            </div>
            <div
              class="text-5xl md:text-7xl font-black italic tracking-tighter uppercase font-['Poppins'] text-white leading-none"
            >
              RUN<span class="text-rungreen">GO</span>RUN
            </div>
          </div>
          <p
            class="text-gray-400 font-bold italic text-lg md:text-2xl leading-[1.1] max-w-xl"
          >
            Movement is a clinical science. Our systems are engineered at the
            intersection of physical limits and strategy.
          </p>
        </div>

        <div class="md:col-span-3 space-y-8 md:space-y-10">
          <h5
            class="text-rungreen font-black uppercase text-[10px] tracking-[0.5em] italic border-b border-white/5 pb-4"
          >
            Internal_Links
          </h5>
          <ul class="space-y-4 md:space-y-6">
            <li
              v-for="l in [
                { n: 'The Collection', path: '#categories' },
                { n: 'Protocol', path: '#science' },
                { n: 'Inventory', path: '/categories' },
              ]"
              :key="l.n"
              @click="handleFooterLink(l.path)"
              class="group cursor-pointer flex items-center gap-3"
            >
              <div
                class="h-1 w-0 bg-rungreen group-hover:w-4 transition-all"
              ></div>
              <span
                class="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-white"
                >{{ l.n }}</span
              >
            </li>
          </ul>
        </div>

        <div class="md:col-span-3 space-y-8 md:space-y-10">
          <h5
            class="text-rungreen font-black uppercase text-[10px] tracking-[0.5em] italic border-b border-white/5 pb-4"
          >
            Concierge
          </h5>
          <button
            @click="showContact = true"
            class="group flex flex-col items-start gap-2 text-left"
          >
            <span
              class="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-rungreen"
              >Support Terminal</span
            >
            <span
              class="text-xl md:text-2xl font-black italic uppercase text-white font-['Poppins']"
              >Open Link</span
            >
          </button>
        </div>
      </div>

      <!-- COPYRIGHT LINE -->
      <div
        class="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4"
      >
        <p class="text-[10px] font-black uppercase tracking-widest opacity-40">
          © Copyright 2026 Run Go Run. All Rights Reserved.
        </p>

        <!-- SOCIAL ICONS (only rendered once an admin has filled in a handle) -->
        <div v-if="socialLinks.length" class="flex items-center gap-4">
          <a
            v-for="s in socialLinks"
            :key="s.label"
            :href="s.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="s.label"
            class="text-gray-500 hover:text-rungreen transition-colors"
          >
            <Icon :name="s.icon" class="text-lg" />
          </a>
        </div>

        <p class="text-[10px] font-black uppercase tracking-widest opacity-40">
          Accra, Ghana
        </p>
      </div>
    </footer>
  </div>
</template>
