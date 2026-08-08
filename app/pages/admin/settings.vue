<!-- pages/admin/settings.vue -->
<script setup>
definePageMeta({
  layout: 'admin'
})

import { ref, onMounted } from "vue";
import { supabase } from "../../lib/supabase";

const loading = ref(true);
const saving = ref(false);
const error = ref("");
const saved = ref(false);

const settings = ref({
  whatsapp_number: "",
  whatsapp_message: "",
  instagram_url: "",
  facebook_url: "",
  tiktok_url: "",
});

const fetchSettings = async () => {
  loading.value = true;
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (data) {
    settings.value = {
      whatsapp_number: data.whatsapp_number || "",
      whatsapp_message: data.whatsapp_message || "",
      instagram_url: data.instagram_url || "",
      facebook_url: data.facebook_url || "",
      tiktok_url: data.tiktok_url || "",
    };
  }
  loading.value = false;
};

const saveSettings = async () => {
  error.value = "";
  saved.value = false;
  saving.value = true;
  try {
    const { error: err } = await supabase
      .from("site_settings")
      .update({
        whatsapp_number: settings.value.whatsapp_number,
        whatsapp_message: settings.value.whatsapp_message,
        instagram_url: settings.value.instagram_url || null,
        facebook_url: settings.value.facebook_url || null,
        tiktok_url: settings.value.tiktok_url || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    if (err) throw err;
    saved.value = true;
    setTimeout(() => (saved.value = false), 3000);
  } catch (err) {
    error.value = err.message;
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  fetchSettings();
});
</script>

<template>
  <div class="min-h-screen bg-runblack font-['Urbanist',_sans-serif]">
    <header class="sticky top-0 z-50 bg-runblack/80 backdrop-blur border-b border-white/5 py-4 px-5 sm:px-8">
      <div class="max-w-3xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div class="flex items-center gap-6">
          <NuxtLink to="/admin" class="text-rungreen font-black italic text-xl font-['Poppins']">
            Run<span class="text-white">Go</span>Run
          </NuxtLink>
          <span class="text-[9px] font-black uppercase tracking-widest text-gray-500 border-l border-white/10 pl-4">
            Settings
          </span>
        </div>
        <div class="flex items-center gap-3">
          <span v-if="saved" class="text-rungreen text-[10px] font-black uppercase tracking-widest">
            Saved ✓
          </span>
          <button
            @click="saveSettings"
            :disabled="saving || loading"
            class="px-5 py-2 bg-rungreen text-black rounded-xl font-black uppercase italic text-[10px] tracking-widest hover:bg-rungreen/80 transition-all disabled:opacity-50"
          >
            {{ saving ? "Saving..." : "Save Settings" }}
          </button>
        </div>
      </div>
    </header>

    <div class="max-w-3xl mx-auto px-5 sm:px-8 py-10">
      <div v-if="loading" class="text-gray-500 text-sm font-bold italic text-center py-20">
        Loading settings...
      </div>

      <div v-else class="space-y-10">
        <div v-if="error" class="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold italic">
          {{ error }}
        </div>

        <!-- WhatsApp -->
        <section class="glass-card-deep rounded-3xl p-6 sm:p-8 border border-white/5 space-y-6">
          <div class="flex items-center gap-3">
            <Icon name="ph:whatsapp-logo-bold" class="text-rungreen text-2xl" />
            <h2 class="text-lg font-black italic uppercase font-['Poppins']">WhatsApp Contact</h2>
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
              WhatsApp Number
            </label>
            <div class="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
              <span class="text-gray-500 text-sm font-bold">+</span>
              <input
                v-model="settings.whatsapp_number"
                type="text"
                placeholder="233270751657"
                class="flex-1 bg-transparent text-white text-sm font-bold focus:outline-none"
              />
            </div>
            <p class="text-gray-600 text-[10px] font-bold italic mt-1">
              Country code + number, no spaces or "+" (e.g. 233270751657). Used for order messages and every "Contact us" button on the site.
            </p>
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
              Default Order Message
            </label>
            <textarea
              v-model="settings.whatsapp_message"
              rows="3"
              placeholder="Hello, I am interested in ordering this product from your website."
              class="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 text-sm font-bold focus:outline-none focus:border-rungreen/50 transition-all resize-none"
            ></textarea>
            <p class="text-gray-600 text-[10px] font-bold italic mt-1">
              Appended to the end of every product order message sent via WhatsApp.
            </p>
          </div>
        </section>

        <!-- Social Media -->
        <section class="glass-card-deep rounded-3xl p-6 sm:p-8 border border-white/5 space-y-6">
          <div class="flex items-center gap-3">
            <Icon name="ph:share-network-bold" class="text-rungreen text-2xl" />
            <h2 class="text-lg font-black italic uppercase font-['Poppins']">Social Media Handles</h2>
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
              <Icon name="ph:instagram-logo-bold" class="inline text-sm mr-1" /> Instagram URL
            </label>
            <input
              v-model="settings.instagram_url"
              type="url"
              placeholder="https://instagram.com/rungorun"
              class="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 text-sm font-bold focus:outline-none focus:border-rungreen/50 transition-all"
            />
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
              <Icon name="ph:facebook-logo-bold" class="inline text-sm mr-1" /> Facebook URL
            </label>
            <input
              v-model="settings.facebook_url"
              type="url"
              placeholder="https://facebook.com/rungorun"
              class="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 text-sm font-bold focus:outline-none focus:border-rungreen/50 transition-all"
            />
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
              <Icon name="ph:tiktok-logo-bold" class="inline text-sm mr-1" /> TikTok URL
            </label>
            <input
              v-model="settings.tiktok_url"
              type="url"
              placeholder="https://tiktok.com/@rungorun"
              class="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 text-sm font-bold focus:outline-none focus:border-rungreen/50 transition-all"
            />
          </div>
          <p class="text-gray-600 text-[10px] font-bold italic">
            Each icon appears in the site footer automatically once its URL is filled in here — leave one blank and it stays hidden.
          </p>
        </section>
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
