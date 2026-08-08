<!-- pages/admin/subscribers.vue -->
<script setup>
definePageMeta({
  layout: 'admin'
})

import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../../lib/supabase";

const router = useRouter();
const count = ref(null);
const breakdown = ref([]);
const unanswered = ref(0);
const loadingCount = ref(true);
const subject = ref("");
const message = ref("");
const sending = ref(false);
const result = ref(null);
const error = ref("");

const authedFetch = async (url, options = {}) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    router.push("/admin/login");
    throw new Error("No session");
  }
  return $fetch(url, {
    ...options,
    headers: { Authorization: `Bearer ${session.access_token}` },
  });
};

const fetchCount = async () => {
  loadingCount.value = true;
  try {
    const data = await authedFetch("/api/admin/subscribers");
    count.value = data.count;
    breakdown.value = data.breakdown || [];
    unanswered.value = data.unanswered || 0;
  } catch (err) {
    console.error("Failed to load subscriber count:", err);
  } finally {
    loadingCount.value = false;
  }
};

const sendBroadcast = async () => {
  error.value = "";
  result.value = null;

  if (!subject.value.trim() || !message.value.trim()) {
    error.value = "Subject and message are required.";
    return;
  }

  if (!confirm(`Send this to ${count.value ?? "all"} subscribers? This can't be undone.`)) {
    return;
  }

  sending.value = true;
  try {
    const data = await authedFetch("/api/admin/broadcast", {
      method: "POST",
      body: { subject: subject.value, message: message.value },
    });
    result.value = data;
    subject.value = "";
    message.value = "";
  } catch (err) {
    error.value = err?.data?.statusMessage || "Broadcast failed. Please try again.";
  } finally {
    sending.value = false;
  }
};

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    router.push("/admin/login");
    return;
  }
  fetchCount();
});
</script>

<template>
  <div class="min-h-screen bg-runblack font-['Urbanist',_sans-serif]">
    <header class="border-b border-white/5 py-5 px-5 sm:px-8">
      <div class="max-w-4xl mx-auto flex justify-between items-center">
        <div class="flex items-center gap-6">
          <NuxtLink to="/admin/dashboard" class="text-rungreen font-black italic text-xl font-['Poppins']">
            Run<span class="text-white">Go</span>Run
          </NuxtLink>
          <span class="text-[9px] font-black uppercase tracking-widest text-gray-500 border-l border-white/10 pl-4">
            Broadcast
          </span>
        </div>
        <NuxtLink to="/admin/dashboard" class="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-rungreen transition-colors">
          ← Dashboard
        </NuxtLink>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-5 sm:px-8 py-10">
      <div class="glass-card-deep rounded-3xl p-6 border border-white/5 mb-6 flex items-center justify-between">
        <div>
          <p class="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">Active Subscribers</p>
          <p class="text-3xl font-black italic font-['Poppins'] text-rungreen">
            {{ loadingCount ? "..." : count }}
          </p>
        </div>
        <Icon name="ph:users-three-bold" class="text-white/10 text-5xl" />
      </div>

      <!-- Referral Breakdown -->
      <div v-if="!loadingCount" class="glass-card-deep rounded-3xl p-6 border border-white/5 mb-6">
        <h2 class="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
          Where Subscribers Found Us
        </h2>
        <div v-if="breakdown.length === 0 && unanswered === 0" class="text-gray-600 text-sm font-bold italic">
          No responses yet.
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="item in breakdown"
            :key="item.source"
            class="flex items-center justify-between gap-4"
          >
            <span class="text-white text-sm font-bold truncate">{{ item.source }}</span>
            <div class="flex items-center gap-3 flex-1 max-w-xs">
              <div class="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  class="h-full bg-rungreen rounded-full"
                  :style="`width: ${(item.count / (count || 1)) * 100}%`"
                ></div>
              </div>
              <span class="text-rungreen text-xs font-black w-8 text-right">{{ item.count }}</span>
            </div>
          </div>
          <div v-if="unanswered > 0" class="flex items-center justify-between gap-4 pt-2 border-t border-white/5 mt-2">
            <span class="text-gray-500 text-sm font-bold italic truncate">Skipped / no answer</span>
            <span class="text-gray-500 text-xs font-black">{{ unanswered }}</span>
          </div>
        </div>
      </div>

      <div class="glass-card-deep rounded-3xl p-6 md:p-8 border border-white/5">
        <h1 class="text-xl font-black italic uppercase font-['Poppins'] text-white mb-6">
          Compose <span class="text-rungreen">Broadcast</span>
        </h1>

        <div v-if="result" class="mb-6 p-4 rounded-2xl bg-rungreen/10 border border-rungreen/30 text-rungreen text-sm font-bold">
          Sent to {{ result.sent }} of {{ result.total }} subscribers.
        </div>

        <div class="space-y-4">
          <input
            v-model="subject"
            type="text"
            placeholder="Subject line"
            :disabled="sending"
            class="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 text-sm font-bold focus:outline-none focus:border-rungreen/50 disabled:opacity-50"
          />
          <textarea
            v-model="message"
            placeholder="Write your update... (blank line = new paragraph)"
            rows="10"
            :disabled="sending"
            class="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 text-sm font-bold focus:outline-none focus:border-rungreen/50 disabled:opacity-50 resize-none"
          ></textarea>

          <p v-if="error" class="text-red-400 text-xs font-bold italic">{{ error }}</p>

          <button
            @click="sendBroadcast"
            :disabled="sending"
            class="w-full py-4 bg-rungreen text-black rounded-2xl font-black uppercase italic text-sm tracking-widest hover:bg-white transition-all disabled:opacity-50"
          >
            {{ sending ? "Sending..." : "Send Broadcast" }}
          </button>
        </div>
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
