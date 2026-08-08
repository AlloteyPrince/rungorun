<!-- pages/admin/index.vue -->
<script setup>
definePageMeta({
  layout: 'admin'
})

import { ref, onMounted } from "vue";
import { supabase } from "../../lib/supabase";

const postCount = ref(null);
const productCount = ref(null);
const whatsappNumber = ref(null);
const loading = ref(true);

const fetchOverview = async () => {
  try {
    const [{ count: posts }, { count: products }, { data: settings }] = await Promise.all([
      supabase.from("posts").select("*", { count: "exact", head: true }),
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("site_settings").select("whatsapp_number").eq("id", 1).maybeSingle(),
    ]);
    postCount.value = posts ?? 0;
    productCount.value = products ?? 0;
    whatsappNumber.value = settings?.whatsapp_number ?? "—";
  } catch (err) {
    console.error("Error loading admin overview:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchOverview();
});

const cards = [
  {
    key: "blog",
    title: "Blog",
    desc: "Write, edit, and publish posts on The Circuit.",
    icon: "ph:newspaper-bold",
    to: "/admin/dashboard",
  },
  {
    key: "products",
    title: "Products",
    desc: "Add and edit the gear listed in the store.",
    icon: "ph:package-bold",
    to: "/admin/products",
  },
  {
    key: "settings",
    title: "Settings",
    desc: "WhatsApp number and social media handles.",
    icon: "ph:gear-six-bold",
    to: "/admin/settings",
  },
];
</script>

<template>
  <div class="min-h-screen bg-runblack font-['Urbanist',_sans-serif]">
    <!-- Header -->
    <header class="border-b border-white/5 py-5 px-5 sm:px-8">
      <div class="max-w-6xl mx-auto flex justify-between items-center">
        <div class="flex items-center gap-6">
          <span class="text-rungreen font-black italic text-xl font-['Poppins']">
            Run<span class="text-white">Go</span>Run
          </span>
          <span class="text-[9px] font-black uppercase tracking-widest text-gray-500 border-l border-white/10 pl-4">
            The Circuit Control
          </span>
        </div>
        <button
          @click="supabase.auth.signOut()"
          class="text-[10px] font-black uppercase tracking-widest text-red-400/60 hover:text-red-400 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>

    <div class="max-w-6xl mx-auto px-5 sm:px-8 py-14">
      <h1 class="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter font-['Poppins'] mb-2">
        Welcome <span class="text-rungreen">Back.</span>
      </h1>
      <p class="text-gray-500 font-bold italic mb-12">Pick a section to manage.</p>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <NuxtLink
          v-for="card in cards"
          :key="card.key"
          :to="card.to"
          class="glass-card-deep rounded-[40px] p-8 sm:p-10 border border-white/5 group hover:border-rungreen/40 transition-all flex flex-col justify-between min-h-[260px]"
        >
          <div>
            <div class="w-16 h-16 rounded-2xl bg-rungreen/10 flex items-center justify-center mb-8 group-hover:bg-rungreen group-hover:text-black transition-all">
              <Icon :name="card.icon" class="text-3xl text-rungreen group-hover:text-black transition-colors" />
            </div>
            <h2 class="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter font-['Poppins'] text-white group-hover:text-rungreen transition-colors mb-2">
              {{ card.title }}
            </h2>
            <p class="text-gray-500 text-sm font-bold italic leading-snug">
              {{ card.desc }}
            </p>
          </div>

          <div class="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            <span v-if="loading" class="text-gray-600 text-[10px] font-black uppercase tracking-widest animate-pulse">
              Loading...
            </span>
            <template v-else>
              <span v-if="card.key === 'blog'" class="text-rungreen text-[10px] font-black uppercase tracking-widest">
                {{ postCount }} {{ postCount === 1 ? "post" : "posts" }}
              </span>
              <span v-else-if="card.key === 'products'" class="text-rungreen text-[10px] font-black uppercase tracking-widest">
                {{ productCount }} {{ productCount === 1 ? "product" : "products" }}
              </span>
              <span v-else class="text-rungreen text-[10px] font-black uppercase tracking-widest truncate">
                +{{ whatsappNumber }}
              </span>
            </template>
            <Icon name="ph:arrow-right-bold" class="text-lg text-white/20 group-hover:text-rungreen group-hover:translate-x-1 transition-all" />
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-card-deep {
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
  backdrop-filter: blur(80px);
}
</style>
