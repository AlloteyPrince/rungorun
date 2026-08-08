<!-- pages/admin/login.vue -->
<script setup>
definePageMeta({
  layout: 'admin'
})

import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../../lib/supabase";

const router = useRouter();
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const handleLogin = async () => {
  loading.value = true;
  error.value = "";
  
  try {
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    
    if (err) throw err;
    router.push("/admin");
  } catch (err) {
    error.value = err.message || "Invalid credentials";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-runblack flex items-center justify-center px-5 font-['Urbanist',_sans-serif]">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-12">
        <div class="text-rungreen text-4xl font-black italic font-['Poppins'] tracking-tighter">
          Run<span class="text-white">Go</span>Run
        </div>
        <p class="text-gray-500 text-xs font-black uppercase tracking-widest mt-2">Admin Access</p>
      </div>

      <!-- Login Card -->
      <div class="glass-card-deep rounded-[40px] p-8 md:p-10 border border-white/5">
        <h1 class="text-2xl font-black italic uppercase tracking-tighter font-['Poppins'] text-white mb-2">
          The Circuit <span class="text-gray-500">Control</span>
        </h1>
        <p class="text-gray-500 text-sm font-bold italic mb-8">
          Enter your credentials to manage the movement.
        </p>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
              Email
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="you@rungorun.store"
              class="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 text-sm font-bold focus:outline-none focus:border-rungreen/50 transition-all"
              required
            />
          </div>

          <div>
            <label class="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
              Password
            </label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 text-sm font-bold focus:outline-none focus:border-rungreen/50 transition-all"
              required
            />
          </div>

          <div v-if="error" class="text-red-400 text-xs font-bold italic">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-4 bg-rungreen text-black rounded-2xl font-black uppercase italic text-sm tracking-widest hover:bg-rungreen/80 transition-all disabled:opacity-50"
          >
            {{ loading ? 'Authenticating...' : 'Enter The Circuit' }}
          </button>
        </form>
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