<script setup>
import { getProductById } from '~/data/products'
import { useWhatsApp } from '~/composables/useWhatsApp'

const route = useRoute()
const { orderOnWhatsApp } = useWhatsApp()

const showContact = useState('contact_modal', () => false)
const product = getProductById(route.params.id)
if (!product) navigateTo('/products')

const activeImage = ref(product?.images?.[0] ?? null)
const quantity = ref(1)
const selectedSize = ref(product?.sizes?.[0] ?? 'Standard')
const sizes = product?.sizes ?? []

const updateQuantity = (val) => {
  if (quantity.value + val >= 1) quantity.value += val
}

const handleOrder = () => {
  orderOnWhatsApp(product.name, product.price, quantity.value, selectedSize.value)
}

useHead({ title: `${product?.name} | RUNGORUN` })

useSeoMeta({
  ogTitle: `${product?.name} | RUN GO RUN`,
  ogDescription: `GHS ${product?.price} - ${product?.description}`,
  ogImage: `https://rungorun.netlify.app${product?.images?.[0]}`,
  ogUrl: `https://rungorun.netlify.app/products/${product?.id}`,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div class="bg-runblack text-white selection:bg-rungreen selection:text-black min-h-screen font-['Urbanist',_sans-serif]">

    <main class="pt-28 pb-10 min-h-screen flex items-center">
      <div class="container mx-auto px-5 sm:px-6 max-w-7xl w-full">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">

          <!-- LEFT: IMAGE GALLERY -->
          <div class="lg:col-span-7 space-y-3">
            <div class="glass-card-deep rounded-[32px] aspect-[4/3] lg:aspect-[16/11] overflow-hidden border border-white/5 flex items-center justify-center relative group">
              <div class="absolute top-5 left-5 bg-rungreen text-black text-[10px] font-black px-3 py-1.5 uppercase rounded-md z-10 italic">
                Live Circuit // Deployment
              </div>
              <img
                v-if="activeImage"
                :src="activeImage"
                :alt="product.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div v-else class="flex flex-col items-center justify-center gap-3 opacity-20">
                <Icon name="ph:sneaker-move-bold" class="text-white text-[8rem]" />
                <span class="text-white text-xs font-black uppercase tracking-widest">No Image</span>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-runblack/80 to-transparent opacity-60"></div>
            </div>

            <!-- THUMBNAILS -->
            <div class="grid grid-cols-4 gap-3">
              <div
                v-for="i in 4"
                :key="i"
                @click="product.images[i - 1] ? activeImage = product.images[i - 1] : null"
                :class="[
                  'glass border aspect-square rounded-[16px] overflow-hidden flex items-center justify-center transition-all',
                  product.images[i - 1] ? 'cursor-pointer' : 'cursor-default opacity-40',
                  activeImage === product.images[i - 1] ? 'border-rungreen' : 'border-white/10 hover:border-white/20'
                ]"
              >
                <img
                  v-if="product.images[i - 1]"
                  :src="product.images[i - 1]"
                  :alt="`${product.name} view ${i}`"
                  class="w-full h-full object-cover"
                />
                <Icon
                  v-else
                  name="ph:sneaker-move-bold"
                  class="text-white/20 text-4xl"
                />
              </div>
            </div>
          </div>

          <!-- RIGHT: SPECS & ACTION -->
          <div class="lg:col-span-5 space-y-5 text-left">
            <header class="space-y-2">
              <div class="flex items-center gap-4 text-rungreen font-black italic tracking-[0.3em] text-xs uppercase">
                <span>{{ product.system }}</span>
                <span class="w-1.5 h-1.5 bg-rungreen rounded-full animate-pulse"></span>
                <span>{{ product.category }}</span>
              </div>
              <h1 class="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-[0.9] font-['Poppins']">
                {{ product.name }}
              </h1>
              <div class="text-2xl font-black italic text-rungreen tracking-tighter flex items-center gap-3">
                <span class="text-sm opacity-50 not-italic uppercase tracking-widest font-bold">MSRP</span>
                GHS {{ product.price }}
              </div>
            </header>

            <p class="text-gray-300 font-bold italic text-base leading-relaxed border-l-4 border-rungreen pl-4">
              {{ product.description }}
            </p>

            <!-- SIZE SELECTION -->
            <div v-if="product.sizing === 'sized'" class="space-y-2">
              <h3 class="text-white font-black uppercase text-xs tracking-[0.4em] italic opacity-60">Select_Size</h3>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="size in sizes"
                  :key="size"
                  @click="selectedSize = size"
                  :class="[
                    'w-11 h-11 rounded-xl font-black flex items-center justify-center border transition-all duration-300 text-sm',
                    selectedSize === size ? 'bg-rungreen border-rungreen text-black scale-105' : 'border-white/10 hover:border-white/40 text-white/60'
                  ]"
                >
                  {{ size }}
                </button>
              </div>
            </div>

            <!-- QUANTITY -->
            <div class="space-y-2">
              <h3 class="text-white font-black uppercase text-xs tracking-[0.4em] italic opacity-60">Quantity_Units</h3>
              <div class="flex items-center gap-5 bg-white/5 w-fit px-5 py-2 rounded-xl border border-white/10">
                <button @click="updateQuantity(-1)" class="text-xl font-black hover:text-rungreen transition-colors px-1">-</button>
                <span class="text-xl font-black w-10 text-center text-rungreen font-['Poppins']">{{ quantity }}</span>
                <button @click="updateQuantity(1)" class="text-xl font-black hover:text-rungreen transition-colors px-1">+</button>
              </div>
            </div>

            <!-- TECHNICAL LOG -->
            <div class="glass-card-deep p-5 rounded-[24px] border border-white/5 space-y-3">
              <h3 class="text-rungreen font-black uppercase text-xs tracking-[0.4em] italic mb-3">Technical_Log</h3>
              <div v-for="spec in product.specs" :key="spec.label" class="flex justify-between items-center border-b border-white/5 pb-2">
                <span class="text-xs font-black uppercase tracking-widest text-gray-400">{{ spec.label }}</span>
                <span class="text-sm font-black uppercase italic tracking-tighter">{{ spec.value }}</span>
              </div>
            </div>

            <!-- ORDER BUTTON -->
            <button
              @click="handleOrder"
              class="btn-global w-full bg-rungreen text-black py-5 rounded-[24px] font-black uppercase italic text-xl flex justify-center items-center gap-4 group"
            >
              DEPLOY ORDER <Icon name="ph:whatsapp-logo-bold" class="text-3xl group-hover:scale-110 transition-transform" />
            </button>

            <p class="text-xs font-black uppercase tracking-[0.2em] text-center opacity-40 italic">
              *All orders are processed via the secure Run Go Run WhatsApp Terminal
            </p>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(12px); }
.glass-card-deep {
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
  backdrop-filter: blur(80px);
}

.btn-global {
  position: relative;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.320, 1);
  animation: pulse-global 2s infinite;
}

.btn-global:hover {
  background: #ffffff;
  transform: translateY(-5px);
}

@keyframes pulse-global {
  0% { box-shadow: 0 0 0 0 rgba(223, 255, 0, 0.6); }
  70% { box-shadow: 0 0 0 30px rgba(223, 255, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(223, 255, 0, 0); }
}
</style>