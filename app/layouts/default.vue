<template>
  <div class="min-h-screen bg-runblack">
    <nav
      class="fixed top-0 w-full z-50 glass px-6 py-5 flex justify-between items-center"
    >
      <div class="text-2xl font-black italic tracking-tighter uppercase">
        RUN<span class="text-rungreen neon-glow">GO</span>RUN
      </div>

      <div
        class="hidden md:flex gap-10 font-black text-[10px] tracking-[0.2em] uppercase"
      >
        <NuxtLink to="/" class="hover:text-rungreen transition">Home</NuxtLink>
        <span class="text-gray-600">Apparel</span>
        <a href="#" class="hover:text-rungreen transition"></a>
      </div>

      <div class="flex items-center gap-4">
        <div class="w-2 h-2 bg-rungreen rounded-full animate-pulse"></div>
        <span
          class="text-[10px] font-bold tracking-widest text-rungreen uppercase"
          >Accra Live</span
        >
      </div>
    </nav>

    <slot />
  </div>
</template>

<style scoped>
.glass {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.neon-glow {
  text-shadow: 0 0 10px rgba(223, 255, 0, 0.5);
}
</style>
