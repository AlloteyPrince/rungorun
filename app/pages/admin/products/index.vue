<!-- pages/admin/products/index.vue -->
<script setup>
definePageMeta({
  layout: 'admin'
})

import { ref, onMounted, computed } from "vue";
import { supabase } from "../../../lib/supabase";

const productsList = ref([]);
const loading = ref(true);
const searchQuery = ref("");
const showSearch = ref(false);
const searchInput = ref(null);

const fetchProducts = async () => {
  loading.value = true;
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw error;
    productsList.value = data || [];
  } catch (err) {
    console.error("Error fetching products:", err);
  } finally {
    loading.value = false;
  }
};

const filteredProducts = computed(() => {
  let result = productsList.value;
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.id?.toLowerCase().includes(q)
    );
  }
  return result;
});

const toggleSearch = () => {
  showSearch.value = !showSearch.value;
  if (showSearch.value) {
    setTimeout(() => searchInput.value?.focus(), 300);
  } else {
    searchQuery.value = "";
  }
};

const clearSearch = () => {
  searchQuery.value = "";
  searchInput.value?.focus();
};

const togglePublish = async (product) => {
  const newStatus = !product.published;
  const { error } = await supabase
    .from("products")
    .update({ published: newStatus, updated_at: new Date().toISOString() })
    .eq("id", product.id);
  if (!error) product.published = newStatus;
};

const deleteProduct = async (id, name) => {
  if (!confirm(`Delete "${name}" permanently? This cannot be undone.`)) return;
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (!error) await fetchProducts();
};

const stats = computed(() => {
  const total = productsList.value.length;
  const published = productsList.value.filter((p) => p.published).length;
  return { total, published, drafts: total - published };
});

onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <div class="min-h-screen bg-runblack font-['Urbanist',_sans-serif]">
    <!-- Header -->
    <header class="border-b border-white/5 py-4 px-5 sm:px-8 sticky top-0 bg-runblack/80 backdrop-blur z-50">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div class="flex items-center gap-6">
          <NuxtLink to="/admin" class="text-rungreen font-black italic text-xl font-['Poppins']">
            Run<span class="text-white">Go</span>Run
          </NuxtLink>
          <span class="text-[9px] font-black uppercase tracking-widest text-gray-500 border-l border-white/10 pl-4 hidden sm:inline">
            Manage Products
          </span>
        </div>
        <div class="flex items-center gap-3 flex-wrap">
          <NuxtLink
            to="/admin/products/create"
            class="px-5 py-2.5 bg-rungreen text-black rounded-xl font-black uppercase italic text-[10px] tracking-widest hover:bg-rungreen/80 transition-all"
          >
            + Add Product
          </NuxtLink>
          <button
            @click="supabase.auth.signOut()"
            class="text-[10px] font-black uppercase tracking-widest text-red-400/60 hover:text-red-400 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-5 sm:px-8 py-8">
      <!-- Stats Bar -->
      <div class="grid grid-cols-3 gap-4 mb-8">
        <div class="glass-card-deep rounded-2xl p-4 text-center border border-white/5">
          <p class="text-2xl font-black italic font-['Poppins'] text-white">{{ stats.total }}</p>
          <p class="text-[8px] font-black uppercase tracking-widest text-gray-500">Total</p>
        </div>
        <div class="glass-card-deep rounded-2xl p-4 text-center border border-white/5">
          <p class="text-2xl font-black italic font-['Poppins'] text-rungreen">{{ stats.published }}</p>
          <p class="text-[8px] font-black uppercase tracking-widest text-gray-500">Live</p>
        </div>
        <div class="glass-card-deep rounded-2xl p-4 text-center border border-white/5">
          <p class="text-2xl font-black italic font-['Poppins'] text-gray-400">{{ stats.drafts }}</p>
          <p class="text-[8px] font-black uppercase tracking-widest text-gray-500">Hidden</p>
        </div>
      </div>

      <!-- Search -->
      <div class="flex justify-end items-center gap-3 mb-6">
        <div
          class="relative overflow-hidden transition-all duration-400 ease-in-out"
          :class="showSearch ? 'w-full sm:w-64 opacity-100' : 'w-0 opacity-0'"
        >
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="Search products..."
            class="w-full px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 text-sm font-bold focus:outline-none focus:border-rungreen/50 transition-all"
          />
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
          >
            <Icon name="ph:x-bold" class="text-sm" />
          </button>
        </div>
        <button
          @click="toggleSearch"
          class="w-11 h-11 rounded-full border border-white/10 hover:border-rungreen/40 hover:bg-rungreen/10 transition-all flex items-center justify-center flex-shrink-0"
          :class="showSearch ? 'border-rungreen/40 bg-rungreen/10' : ''"
        >
          <Icon
            :name="showSearch ? 'ph:x-bold' : 'ph:magnifying-glass-bold'"
            class="text-lg"
            :class="showSearch ? 'text-rungreen' : 'text-white/60'"
          />
        </button>
      </div>

      <!-- Products Table -->
      <div class="glass-card-deep rounded-3xl border border-white/5 overflow-hidden">
        <div v-if="loading" class="p-12 text-center">
          <div class="text-rungreen text-sm font-black uppercase tracking-widest animate-pulse">
            Loading products...
          </div>
        </div>

        <div v-else-if="filteredProducts.length === 0" class="p-12 text-center">
          <Icon name="ph:package-bold" class="text-5xl text-white/10 mb-4" />
          <p class="text-gray-500 font-bold italic">No products found.</p>
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="inline-block mt-4 text-rungreen font-black uppercase tracking-widest text-sm hover:underline"
          >
            Clear search
          </button>
          <NuxtLink
            v-else
            to="/admin/products/create"
            class="inline-block mt-4 text-rungreen font-black uppercase tracking-widest text-sm hover:underline"
          >
            Add your first product →
          </NuxtLink>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="border-b border-white/5 bg-white/5">
              <tr>
                <th class="px-5 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500 w-12">Status</th>
                <th class="px-5 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500">Product</th>
                <th class="px-5 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500 hidden sm:table-cell">Category</th>
                <th class="px-5 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500 hidden md:table-cell">Price</th>
                <th class="px-5 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr
                v-for="product in filteredProducts"
                :key="product.id"
                class="hover:bg-white/5 transition-colors group"
              >
                <td class="px-5 py-4">
                  <button
                    @click="togglePublish(product)"
                    class="relative w-10 h-6 rounded-full transition-all duration-300 focus:outline-none"
                    :class="product.published ? 'bg-rungreen' : 'bg-gray-600'"
                  >
                    <span
                      class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-lg transition-transform duration-300"
                      :class="product.published ? 'translate-x-4' : 'translate-x-0'"
                    ></span>
                    <span class="sr-only">{{ product.published ? 'Live' : 'Hidden' }}</span>
                  </button>
                </td>

                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-white/5 border border-white/5">
                      <img
                        v-if="product.images?.[0]"
                        :src="product.images[0]"
                        :alt="product.name"
                        class="w-full h-full object-cover"
                      />
                      <div v-else class="w-full h-full flex items-center justify-center text-white/10">
                        <Icon name="ph:image-bold" class="text-sm" />
                      </div>
                    </div>
                    <div>
                      <NuxtLink
                        :to="`/products/${product.id}`"
                        target="_blank"
                        class="text-white font-bold text-sm hover:text-rungreen transition-colors line-clamp-1"
                      >
                        {{ product.name }}
                      </NuxtLink>
                      <span class="text-gray-500 text-[9px] font-mono block sm:hidden">
                        {{ product.id }}
                      </span>
                    </div>
                  </div>
                </td>

                <td class="px-5 py-4 hidden sm:table-cell">
                  <span
                    v-if="product.category"
                    class="text-[8px] font-black uppercase tracking-widest text-rungreen bg-rungreen/10 px-3 py-1.5 rounded-full"
                  >
                    {{ product.category }}
                  </span>
                  <span v-else class="text-gray-600 text-[9px] italic">—</span>
                </td>

                <td class="px-5 py-4 hidden md:table-cell">
                  <span class="text-gray-400 text-sm font-bold">GHS {{ product.price }}</span>
                </td>

                <td class="px-5 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <NuxtLink
                      :to="`/admin/products/${product.id}`"
                      class="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-rungreen transition-colors"
                    >
                      Edit
                    </NuxtLink>
                    <span class="text-white/5">|</span>
                    <button
                      @click="deleteProduct(product.id, product.name)"
                      class="text-[9px] font-black uppercase tracking-widest text-red-400/40 hover:text-red-400 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="px-5 py-3 border-t border-white/5 text-center text-[9px] font-black uppercase tracking-widest text-gray-500">
            Showing {{ filteredProducts.length }} of {{ productsList.length }} products
          </div>
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

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
