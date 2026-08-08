<!-- components/admin/AdminProductForm.vue -->
<script setup>
import { ref, computed } from "vue";
import { supabase } from "~/lib/supabase";

const props = defineProps({
  idEditable: { type: Boolean, default: true },
});

const product = defineModel({ required: true });

const CATEGORY_SUGGESTIONS = ["Apparel", "Accessories", "Support", "Metric Tech"];

const uploading = ref(false);
const uploadError = ref("");
const newSize = ref("");

// ── Id / slug (create only — locked once a product exists, since it's the primary key + URL) ──
const generateId = () => {
  if (!props.idEditable) return;
  product.value.id = product.value.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// ── Images ──
const uploadImages = async (event) => {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;

  uploadError.value = "";
  uploading.value = true;
  try {
    for (const file of files) {
      if (product.value.images.length >= 4) break;
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadErr } = await supabase.storage
        .from("images")
        .upload(filePath, file);
      if (uploadErr) throw uploadErr;

      const { data: { publicUrl } } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      product.value.images.push(publicUrl);
    }
  } catch (err) {
    uploadError.value = err.message;
  } finally {
    uploading.value = false;
    event.target.value = "";
  }
};

const removeImage = (index) => {
  product.value.images.splice(index, 1);
};

const makeMainImage = (index) => {
  const [img] = product.value.images.splice(index, 1);
  product.value.images.unshift(img);
};

// ── Sizes (only relevant when sizing === 'sized') ──
const addSize = () => {
  const val = newSize.value.trim();
  if (val && !product.value.sizes.includes(val)) {
    product.value.sizes.push(val);
  }
  newSize.value = "";
};

const removeSize = (index) => {
  product.value.sizes.splice(index, 1);
};

// ── Specs ──
const addSpec = () => {
  product.value.specs.push({ label: "", value: "" });
};

const removeSpec = (index) => {
  product.value.specs.splice(index, 1);
};
</script>

<template>
  <div class="space-y-6">
    <!-- Name + Id -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <label class="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
          Product Name
        </label>
        <input
          v-model="product.name"
          @input="generateId"
          type="text"
          placeholder="e.g. Jogging Arm Band"
          class="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 text-lg font-black focus:outline-none focus:border-rungreen/50 transition-all"
        />
      </div>
      <div>
        <label class="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
          Product ID (URL slug)
        </label>
        <div class="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
          <span class="text-gray-500 text-sm font-bold">/products/</span>
          <input
            v-model="product.id"
            type="text"
            :disabled="!idEditable"
            placeholder="your-product-id"
            class="flex-1 bg-transparent text-white text-sm font-bold focus:outline-none disabled:opacity-50"
          />
        </div>
        <p v-if="!idEditable" class="text-gray-600 text-[10px] font-bold italic mt-1">
          The ID can't change once a product is created — it's part of the live URL.
        </p>
      </div>
    </div>

    <!-- Price + Category -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <label class="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
          Price (GHS)
        </label>
        <input
          v-model="product.price"
          type="text"
          placeholder="120.00"
          class="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 text-sm font-bold focus:outline-none focus:border-rungreen/50 transition-all"
        />
      </div>
      <div>
        <label class="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
          Category
        </label>
        <input
          v-model="product.category"
          type="text"
          list="product-categories"
          placeholder="e.g. Accessories"
          class="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 text-sm font-bold focus:outline-none focus:border-rungreen/50 transition-all"
        />
        <datalist id="product-categories">
          <option v-for="c in CATEGORY_SUGGESTIONS" :key="c" :value="c" />
        </datalist>
      </div>
    </div>

    <!-- Description -->
    <div>
      <label class="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
        Description
      </label>
      <textarea
        v-model="product.description"
        rows="4"
        placeholder="What makes this product worth buying..."
        class="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 text-sm font-bold focus:outline-none focus:border-rungreen/50 transition-all resize-none"
      ></textarea>
    </div>

    <!-- Images -->
    <div>
      <label class="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
        Images (up to 4 — first is the main/WhatsApp card image)
      </label>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div
          v-for="(img, i) in product.images"
          :key="img"
          class="relative aspect-square rounded-2xl overflow-hidden border group"
          :class="i === 0 ? 'border-rungreen' : 'border-white/10'"
        >
          <img :src="img" class="w-full h-full object-cover" />
          <span
            v-if="i === 0"
            class="absolute top-2 left-2 bg-rungreen text-black text-[7px] font-black px-2 py-1 rounded uppercase"
          >
            Main
          </span>
          <div class="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              v-if="i !== 0"
              @click="makeMainImage(i)"
              type="button"
              class="text-[8px] font-black uppercase text-white bg-white/10 px-2 py-1.5 rounded hover:bg-rungreen hover:text-black transition-all"
            >
              Set Main
            </button>
            <button
              @click="removeImage(i)"
              type="button"
              class="text-[8px] font-black uppercase text-white bg-red-500/30 px-2 py-1.5 rounded hover:bg-red-500 transition-all"
            >
              Remove
            </button>
          </div>
        </div>
        <label
          v-if="product.images.length < 4"
          class="aspect-square rounded-2xl border border-dashed border-white/15 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-rungreen/40 transition-all"
        >
          <Icon v-if="!uploading" name="ph:plus-bold" class="text-2xl text-white/40" />
          <span v-else class="text-rungreen text-[9px] font-black uppercase animate-pulse">Uploading...</span>
          <span v-if="!uploading" class="text-[8px] font-black uppercase text-white/40">Add Image</span>
          <input type="file" accept="image/*" multiple class="hidden" @change="uploadImages" :disabled="uploading" />
        </label>
      </div>
      <p v-if="uploadError" class="text-red-400 text-xs font-bold italic">{{ uploadError }}</p>
    </div>

    <!-- Sizing -->
    <div>
      <label class="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
        Sizing
      </label>
      <div class="flex gap-3 mb-4">
        <button
          type="button"
          @click="product.sizing = 'standard'"
          :class="[
            'px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all',
            product.sizing === 'standard' ? 'bg-rungreen text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'
          ]"
        >
          Standard (one size)
        </button>
        <button
          type="button"
          @click="product.sizing = 'sized'"
          :class="[
            'px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all',
            product.sizing === 'sized' ? 'bg-rungreen text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'
          ]"
        >
          Sized (S/M/L, etc.)
        </button>
      </div>

      <div v-if="product.sizing === 'sized'" class="flex flex-wrap gap-2 p-4 bg-white/5 border border-white/10 rounded-2xl">
        <span
          v-for="(size, i) in product.sizes"
          :key="size"
          class="flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest bg-rungreen text-black"
        >
          {{ size }}
          <button type="button" @click="removeSize(i)">
            <Icon name="ph:x-bold" class="text-[10px]" />
          </button>
        </span>
        <input
          v-model="newSize"
          @keyup.enter="addSize"
          type="text"
          placeholder="Add size, press Enter"
          class="bg-transparent text-white placeholder:text-gray-600 text-xs font-bold focus:outline-none px-2"
        />
      </div>
    </div>

    <!-- Specs -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <label class="block text-[10px] font-black uppercase tracking-widest text-gray-500">
          Technical Specs
        </label>
        <button
          type="button"
          @click="addSpec"
          class="text-[9px] font-black uppercase tracking-widest text-rungreen hover:underline"
        >
          + Add Row
        </button>
      </div>
      <div class="space-y-2">
        <div
          v-for="(spec, i) in product.specs"
          :key="i"
          class="flex items-center gap-3"
        >
          <input
            v-model="spec.label"
            type="text"
            placeholder="Label (e.g. Climate)"
            class="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 text-sm font-bold focus:outline-none focus:border-rungreen/50 transition-all"
          />
          <input
            v-model="spec.value"
            type="text"
            placeholder="Value (e.g. High Humidity Optimized)"
            class="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 text-sm font-bold focus:outline-none focus:border-rungreen/50 transition-all"
          />
          <button
            type="button"
            @click="removeSpec(i)"
            class="text-red-400/50 hover:text-red-400 transition-colors flex-shrink-0"
          >
            <Icon name="ph:trash-bold" class="text-lg" />
          </button>
        </div>
        <p v-if="product.specs.length === 0" class="text-gray-600 text-xs font-bold italic">
          No specs yet — add a row to list technical details on the product page.
        </p>
      </div>
    </div>

    <!-- Published -->
    <div class="flex items-center gap-4">
      <button
        type="button"
        @click="product.published = !product.published"
        class="relative w-12 h-7 rounded-full transition-all duration-300 focus:outline-none"
        :class="product.published ? 'bg-rungreen' : 'bg-gray-600'"
      >
        <span
          class="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-lg transition-transform duration-300"
          :class="product.published ? 'translate-x-5' : 'translate-x-0'"
        ></span>
      </button>
      <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">
        {{ product.published ? "Live on the site" : "Hidden (draft)" }}
      </span>
    </div>
  </div>
</template>
