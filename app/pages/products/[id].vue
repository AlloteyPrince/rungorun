<script setup>
import { useWhatsApp } from '~/composables/useWhatsApp'

const route = useRoute()
const { orderOnWhatsApp } = useWhatsApp()

// Global State for the Modal
const showContact = useState('contact_modal', () => false)

// Mock data - This will eventually be replaced by your JSON/SEO engine data
const product = {
  id: route.params.id,
  name: 'V.01 JOGGER',
  price: '450.00',
  category: 'Apparel',
  system: 'SYS.01',
  description: 'Precision-engineered for the Accra climate. Features targeted tension zones for optimal oxygenation and moisture management.',
  specs: [
    { label: 'Formulation', value: 'Performance Textile' },
    { label: 'Origin', value: 'Accra Active Circuit' },
    { label: 'Climate', value: 'High Humidity Optimized' },
    { label: 'Safety', value: 'Clinical Grade' }
  ]
}

// Interaction State
const quantity = ref(1)
const selectedSize = ref('M')
const sizes = ['S', 'M', 'L', 'XL']

const updateQuantity = (val) => {
  if (quantity.value + val >= 1) {
    quantity.value += val
  }
}

const handleOrder = () => {
  const message = `Order Request: 
Item: ${product.name}
Quantity: ${quantity.value}
Size: ${selectedSize.value}
Category: ${product.category}`
  
  orderOnWhatsApp(message)
}

useHead({
  title: `${product.name} | RUN GO RUN`,
})

const scrollToSection = (id) => {
  const el = document.querySelector(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div class="bg-runblack text-white selection:bg-rungreen selection:text-black min-h-screen font-['Urbanist',_sans-serif]">
    
    <!-- NAVIGATION BREADCRUMB -->

    <main class="pt-32 pb-20">
      <div class="container mx-auto px-5 sm:px-6 max-w-7xl">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          <!-- LEFT: VISUAL TERMINAL (IMAGE GALLERY) -->
          <div class="lg:col-span-7 space-y-6">
            <div class="glass-card-deep rounded-[40px] aspect-square md:aspect-[4/5] overflow-hidden border border-white/5 flex items-center justify-center relative group">
              <div class="absolute top-8 left-8 bg-rungreen text-black text-[10px] font-black px-4 py-2 uppercase rounded-md z-10 italic">
                Live Circuit // Deployment
              </div>
              <!-- Replace Icon with product image when ready -->
              <Icon name="ph:sneaker-move-bold" class="text-white/5 text-[15rem] md:text-[25rem] group-hover:scale-110 transition-transform duration-1000" />
              
              <!-- Subtle Background Glow -->
              <div class="absolute inset-0 bg-gradient-to-t from-runblack/80 to-transparent opacity-60"></div>
            </div>
            
            <!-- THUMBNAILS -->
            <div class="grid grid-cols-4 gap-4">
              <div v-for="i in 4" :key="i" class="glass border border-white/10 aspect-square rounded-[20px] flex items-center justify-center hover:border-rungreen transition-all cursor-pointer group">
                <Icon name="ph:image-square-bold" class="text-white/10 text-2xl group-hover:text-rungreen transition-colors" />
              </div>
            </div>
          </div>

          <!-- RIGHT: TECHNICAL SPECS & ACTION -->
          <div class="lg:col-span-5 space-y-10 text-left">
            <header class="space-y-4">
              <div class="flex items-center gap-4 text-rungreen font-black italic tracking-[0.4em] text-[11px] uppercase">
                <span>{{ product.system }}</span>
                <span class="w-1.5 h-1.5 bg-rungreen rounded-full animate-pulse"></span>
                <span>{{ product.category }}</span>
              </div>
              <h1 class="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] font-['Poppins']">
                {{ product.name }}
              </h1>
              <div class="text-4xl font-black italic text-rungreen tracking-tighter flex items-center gap-3">
                <span class="text-sm opacity-50 not-italic uppercase tracking-widest font-bold">MSRP</span>
                GHS {{ product.price }}
              </div>
            </header>

            <p class="text-gray-400 font-bold italic text-lg leading-relaxed border-l-4 border-rungreen pl-6">
              {{ product.description }}
            </p>

            <!-- SIZE SELECTION -->
            <div class="space-y-4">
              <h3 class="text-white font-black uppercase text-[10px] tracking-[0.5em] italic opacity-50">Select_Size</h3>
              <div class="flex flex-wrap gap-3">
                <button 
                  v-for="size in sizes" 
                  :key="size"
                  @click="selectedSize = size"
                  :class="[
                    'w-14 h-14 rounded-2xl font-black flex items-center justify-center border transition-all duration-300',
                    selectedSize === size ? 'bg-rungreen border-rungreen text-black scale-105' : 'border-white/10 hover:border-white/40 text-white/60'
                  ]"
                >
                  {{ size }}
                </button>
              </div>
            </div>

            <!-- QUANTITY DEPLOYMENT -->
            <div class="space-y-4">
              <h3 class="text-white font-black uppercase text-[10px] tracking-[0.5em] italic opacity-50">Quantity_Units</h3>
              <div class="flex items-center gap-6 bg-white/5 w-fit px-6 py-3 rounded-2xl border border-white/10">
                <button @click="updateQuantity(-1)" class="text-2xl font-black hover:text-rungreen transition-colors px-2">-</button>
                <span class="text-2xl font-black w-12 text-center text-rungreen font-['Poppins']">{{ quantity }}</span>
                <button @click="updateQuantity(1)" class="text-2xl font-black hover:text-rungreen transition-colors px-2">+</button>
              </div>
            </div>

            <!-- TECHNICAL LOG (SPEC TABLE) -->
            <div class="glass-card-deep p-8 rounded-[32px] border border-white/5 space-y-4">
              <h3 class="text-rungreen font-black uppercase text-[10px] tracking-[0.5em] italic mb-6">Technical_Log</h3>
              <div v-for="spec in product.specs" :key="spec.label" class="flex justify-between items-center border-b border-white/5 pb-3">
                <span class="text-[10px] font-black uppercase tracking-widest text-gray-500">{{ spec.label }}</span>
                <span class="text-xs font-black uppercase italic tracking-tighter">{{ spec.value }}</span>
              </div>
            </div>

            <!-- ORDER BUTTON -->
            <button 
              @click="handleOrder"
              class="btn-global w-full bg-rungreen text-black py-8 rounded-[30px] font-black uppercase italic text-2xl flex justify-center items-center gap-6 group"
            >
              DEPLOY ORDER <Icon name="ph:whatsapp-logo-bold" class="text-4xl group-hover:scale-110 transition-transform" />
            </button>
            
            <p class="text-[9px] font-black uppercase tracking-[0.3em] text-center opacity-30 italic">
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