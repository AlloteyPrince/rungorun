<script setup>
const activeCategory = ref('All')
const categories = ['All', 'Apparel', 'Accessories', 'Support', 'Metric Tech']

// This would eventually be your JSON-driven plant/product library
const allProducts = [
  { id: 'v01', name: 'V.01 JOGGER', category: 'Apparel', price: '450', system: 'SYS.01' },
  { id: 'v02', name: 'METRIC TEE', category: 'Apparel', price: '250', system: 'SYS.01' },
  { id: 's01', name: 'RECOVERY BALM', category: 'Support', price: '180', system: 'SYS.03' },
  // ... more products
]

const filteredProducts = computed(() => {
  if (activeCategory.value === 'All') return allProducts
  return allProducts.filter(p => p.category === activeCategory.value)
})
</script>

<template>
  <div class="bg-runblack min-h-screen pt-32 pb-20">
    <div class="container mx-auto px-6">
      <h1 class="text-6xl font-black italic uppercase mb-12 font-['Poppins']">The <span class="text-rungreen">Inventory.</span></h1>
      
      <!-- FILTER CHIPS -->
      <div class="flex flex-wrap gap-4 mb-16">
        <button 
          v-for="cat in categories" :key="cat"
          @click="activeCategory = cat"
          :class="[
            'px-8 py-3 rounded-full font-black uppercase italic text-[10px] tracking-widest transition-all border',
            activeCategory === cat ? 'bg-rungreen border-rungreen text-black' : 'border-white/10 text-gray-500 hover:border-white/40'
          ]"
        >
          {{ cat }}
        </button>
      </div>

      <!-- DYNAMIC GRID -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <NuxtLink 
          v-for="product in filteredProducts" 
          :key="product.id"
          :to="`/products/${product.id}`"
          class="glass-card-deep p-8 rounded-[40px] border border-white/5 group hover:border-rungreen/40 transition-all"
        >
          <!-- Product Card Content (as used in index.vue) -->
          <div class="aspect-square bg-white/[0.02] rounded-[30px] mb-8 flex items-center justify-center">
             <Icon name="ph:package-bold" class="text-6xl text-white/10 group-hover:text-rungreen transition-colors" />
          </div>
          <h3 class="text-2xl font-black italic uppercase mb-2">{{ product.name }}</h3>
          <p class="text-rungreen font-black italic">GHS {{ product.price }}</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>