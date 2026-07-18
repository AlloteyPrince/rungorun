<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "~/lib/supabase";

const props = defineProps({
  source: { type: String, default: "" },
});

const STORAGE_KEY = "rgr_subscribed";

const email = ref("");
const status = ref("form"); // form | loading | success | existing | error
const errorMessage = ref("");

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

onMounted(() => {
  if (localStorage.getItem(STORAGE_KEY) === "true") {
    status.value = "existing";
  }
});

const subscribe = async () => {
  errorMessage.value = "";

  if (!isValidEmail(email.value)) {
    errorMessage.value = "Enter a valid email address.";
    return;
  }

  status.value = "loading";

  const { error } = await supabase.from("subscribers").insert({
    email: email.value.trim().toLowerCase(),
    source: props.source || null,
  });

  if (error) {
    // 23505 = unique_violation -> email is already subscribed
    if (error.code === "23505") {
      localStorage.setItem(STORAGE_KEY, "true");
      status.value = "existing";
    } else {
      console.error("Subscribe insert failed:", error);
      status.value = "form";
      errorMessage.value = "Something went wrong. Please try again.";
    }
    return;
  }

  localStorage.setItem(STORAGE_KEY, "true");
  status.value = "success";

  $fetch("/api/subscribe/welcome", {
    method: "POST",
    body: { email: email.value.trim().toLowerCase() },
  }).catch((err) => console.error("Welcome email failed:", err));
};
</script>

<template>
  <section class="py-20 md:py-28">
    <div class="container mx-auto px-5 sm:px-6 max-w-6xl">
      <div class="glass-card-deep rounded-[40px] md:rounded-[60px] border border-white/5 p-8 md:p-16 text-center">
        <span class="text-rungreen font-black text-[10px] tracking-[0.4em] uppercase mb-4 block">
          Stay In The Loop
        </span>
        <h2 class="text-[clamp(2rem,6vw,3.5rem)] font-black italic uppercase tracking-tighter leading-[0.9] font-['Poppins'] text-white mb-6">
          Join The <span class="text-rungreen">Circuit.</span>
        </h2>
        <p class="text-gray-400 font-bold italic text-base md:text-lg max-w-xl mx-auto mb-10">
          Weekly drops, training notes, and community updates — straight to your inbox.
        </p>

        <!-- Already subscribed -->
        <div v-if="status === 'existing'" class="max-w-md mx-auto flex flex-col items-center gap-3">
          <Icon name="ph:check-circle-bold" class="text-rungreen text-4xl" />
          <p class="text-white font-black uppercase italic text-lg leading-snug">
            You're already part of the Circuit — we've got you.
          </p>
        </div>

        <!-- Success -->
        <div v-else-if="status === 'success'" class="max-w-md mx-auto flex flex-col items-center gap-3">
          <Icon name="ph:check-circle-bold" class="text-rungreen text-4xl" />
          <p class="text-white font-black uppercase italic text-lg leading-snug">
            You're in. Welcome to the community.
          </p>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="subscribe" class="max-w-md mx-auto">
          <div class="flex flex-col sm:flex-row gap-3">
            <input
              v-model="email"
              type="email"
              required
              placeholder="you@email.com"
              :disabled="status === 'loading'"
              class="flex-1 px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 text-sm font-bold focus:outline-none focus:border-rungreen/50 disabled:opacity-50 transition-colors"
            />
            <button
              type="submit"
              :disabled="status === 'loading'"
              class="px-8 py-4 bg-rungreen text-black rounded-2xl font-black uppercase italic text-xs tracking-widest hover:bg-white transition-all disabled:opacity-50 whitespace-nowrap"
            >
              {{ status === "loading" ? "Joining..." : "Join The Circuit" }}
            </button>
          </div>
          <p v-if="errorMessage" class="text-red-400 text-xs font-bold italic mt-3">
            {{ errorMessage }}
          </p>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.glass-card-deep {
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
  backdrop-filter: blur(80px);
}
</style>