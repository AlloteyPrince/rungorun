<script setup>
defineProps(["isOpen", "title"]);
defineEmits(["close"]);
</script>

<template>
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center px-6"
    >
      <div
        class="absolute inset-0 bg-runblack/90 backdrop-blur-md"
        @click="$emit('close')"
      ></div>

      <div
        class="relative bg-[#111] border border-white/10 w-full max-w-2xl p-8 md:p-12 shadow-2xl overflow-hidden"
      >
        <button
          @click="$emit('close')"
          class="absolute top-6 right-6 text-gray-500 hover:text-rungreen transition-colors"
        >
          <Icon name="heroicons:x-mark-20-solid" class="text-3xl" />
        </button>

        <div class="relative z-10">
          <span
            class="text-rungreen font-black tracking-[0.3em] text-[10px] uppercase mb-4 block"
            >RUNGORUN / {{ title }}</span
          >
          <h2
            class="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-8 leading-none"
          >
            {{ title }}
          </h2>

          <div class="space-y-6 text-gray-400 font-medium leading-relaxed">
            <slot />
          </div>

          <div class="mt-12">
            <button
              @click="
                () => {
                  const phone = useAppConfig().brand.whatsappNumber;
                  const text = `👋 Hello Run Go Run!\n━━━━━━━━━━━━\n💬 Type: Support and Feedback\n🌐 Via: RunGoRun Website\n━━━━━━━━━━━━\n`;
                  window.open(
                    `https://wa.me/${phone}?text=${encodeURIComponent(text)}`,
                    '_blank',
                  );
                }
              "
              class="group flex items-center gap-4 bg-white text-black px-8 py-4 font-black uppercase italic hover:bg-rungreen transition-all"
            >
              Contact RunGoRun via WhatsApp
              <Icon
                name="mdi:whatsapp"
                class="text-2xl group-hover:scale-110 transition-transform"
              />
            </button>
          </div>
        </div>

        <div
          class="absolute -bottom-10 -right-10 text-[12rem] font-black italic text-white/[0.02] pointer-events-none uppercase"
        >
          Run
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
