<!-- pages/admin/products/create.vue -->
<script setup>
definePageMeta({
  layout: 'admin'
})

import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../../../lib/supabase";

const router = useRouter();
const saving = ref(false);
const error = ref("");

const product = ref({
  id: "",
  name: "",
  price: "",
  category: "",
  description: "",
  images: [],
  sizing: "standard",
  sizes: [],
  specs: [],
  published: true,
});

const saveProduct = async () => {
  error.value = "";

  if (!product.value.id || !product.value.name) {
    error.value = "Name and Product ID are required.";
    return;
  }

  saving.value = true;
  try {
    const { error: err } = await supabase.from("products").insert({
      id: product.value.id,
      name: product.value.name,
      price: product.value.price,
      category: product.value.category,
      description: product.value.description,
      images: product.value.images,
      sizing: product.value.sizing,
      sizes: product.value.sizing === "sized" ? product.value.sizes : [],
      specs: product.value.specs.filter((s) => s.label && s.value),
      published: product.value.published,
    });

    if (err) throw err;
    router.push("/admin/products");
  } catch (err) {
    error.value = err.message;
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-runblack font-['Urbanist',_sans-serif]">
    <header class="sticky top-0 z-50 bg-runblack/80 backdrop-blur border-b border-white/5 py-4 px-5 sm:px-8">
      <div class="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div class="flex items-center gap-6">
          <NuxtLink to="/admin" class="text-rungreen font-black italic text-xl font-['Poppins']">
            Run<span class="text-white">Go</span>Run
          </NuxtLink>
          <span class="text-[9px] font-black uppercase tracking-widest text-gray-500 border-l border-white/10 pl-4">
            New Product
          </span>
        </div>
        <div class="flex items-center gap-3">
          <NuxtLink
            to="/admin/products"
            class="px-5 py-2 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:border-white/30 transition-all"
          >
            Cancel
          </NuxtLink>
          <button
            @click="saveProduct"
            :disabled="saving"
            class="px-5 py-2 bg-rungreen text-black rounded-xl font-black uppercase italic text-[10px] tracking-widest hover:bg-rungreen/80 transition-all disabled:opacity-50"
          >
            {{ saving ? "Saving..." : "Save Product" }}
          </button>
        </div>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-5 sm:px-8 py-10">
      <div v-if="error" class="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold italic">
        {{ error }}
      </div>

      <AdminProductForm v-model="product" :id-editable="true" />
    </div>
  </div>
</template>
