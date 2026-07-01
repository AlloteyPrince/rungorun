<!-- pages/blog/index.vue -->
<script setup>
import { ref, onMounted, computed } from "vue";

const posts = ref([]);
const loading = ref(true);
const visibleSections = ref(new Set());
const selectedCategory = ref("all");
const searchQuery = ref("");
const categories = ref([]);

const fetchCategories = async () => {
  const { data } = await supabase.from("tags").select("*").order("name");
  if (data) categories.value = data;
};

const fetchPosts = async () => {
  loading.value = true;
  try {
    let query = supabase
      .from("posts")
      .select(`
        *,
        authors:author_id (name, bio, avatar),
        post_tags:post_tags (tags:tag_id (name, slug))
      `)
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (selectedCategory.value !== "all") {
      query = query.eq("category", selectedCategory.value);
    }

    const { data, error } = await query;
    if (error) throw error;
    posts.value = data || [];
  } catch (err) {
    console.error("Error fetching posts:", err);
  } finally {
    loading.value = false;
  }
};

const filteredPosts = computed(() => {
  if (!searchQuery.value) return posts.value;
  const q = searchQuery.value.toLowerCase();
  return posts.value.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.content?.toLowerCase().includes(q)
  );
});

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const stripMarkdown = (text) => {
  if (!text) return "";
  return text
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[.*?\]\(.*?\)/g, "")
    .replace(/[#*`~_>]/g, "")
    .trim();
};

const truncate = (text, length = 140) => {
  if (!text) return "";
  const clean = stripMarkdown(text);
  return clean.length > length ? clean.slice(0, length) + "..." : clean;
};

onMounted(() => {
  fetchPosts();
  fetchCategories();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleSections.value.add(entry.target.id);
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll("section").forEach((s) => observer.observe(s));
});
</script>

<template>
  <div class="bg-runblack text-white min-h-screen font-['Urbanist',_sans-serif]">
    <!-- ── HERO ── -->
    <section id="blog-hero" class="relative min-h-[40vh] flex items-center overflow-hidden border-b border-white/5">
      <div class="absolute inset-0 z-0">
        <div class="absolute inset-0 bg-gradient-to-b from-runblack/40 via-runblack/60 to-runblack z-10"></div>
        <img
          src="/images/blog-hero.jpg"
          class="w-full h-full object-cover opacity-30 pointer-events-none"
          alt="The Circuit"
        />
      </div>
      <div class="container mx-auto px-5 sm:px-6 max-w-6xl relative z-20 py-16">
        <div
          :class="[
            'transition-all duration-1000 transform',
            visibleSections.has('blog-hero')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-20',
          ]"
        >
          <div class="flex items-center gap-4 mb-4">
            <span class="text-rungreen font-black text-[10px] tracking-[0.4em] uppercase">The Circuit</span>
            <span class="text-white/20 text-2xl font-light">/</span>
            <span class="text-white/40 text-[9px] font-black uppercase tracking-widest">The Run Go Run Blog</span>
          </div>
          <h1 class="text-[clamp(2.8rem,8vw,5.5rem)] font-black italic uppercase tracking-tighter leading-[0.9] font-['Poppins']">
            The <span class="text-rungreen text-shadow-glow">Circuit.</span>
          </h1>
          <p class="text-gray-300 text-base sm:text-lg italic font-bold max-w-2xl border-l-4 border-rungreen pl-5 leading-tight mt-4">
            Strategy, sweat, and science from the streets of Accra.
          </p>
        </div>
      </div>
    </section>

    <div class="container mx-auto px-5 sm:px-6 max-w-6xl">
      <!-- ── FILTERS ── -->
      <section class="py-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-white/5">
        <div class="flex flex-wrap gap-2">
          <button
            @click="selectedCategory = 'all'; fetchPosts()"
            :class="[
              'px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all',
              selectedCategory === 'all'
                ? 'bg-rungreen text-black'
                : 'bg-white/5 text-white/50 hover:bg-white/10'
            ]"
          >
            All
          </button>
          <button
            v-for="tag in categories"
            :key="tag.id"
            @click="selectedCategory = tag.slug; fetchPosts()"
            :class="[
              'px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all',
              selectedCategory === tag.slug
                ? 'bg-rungreen text-black'
                : 'bg-white/5 text-white/50 hover:bg-white/10'
            ]"
          >
            {{ tag.name }}
          </button>
        </div>

        <div class="relative w-full sm:w-auto">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search posts..."
            class="w-full sm:w-64 px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 text-sm font-bold focus:outline-none focus:border-rungreen/50 transition-all"
          />
          <Icon name="ph:magnifying-glass-bold" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" />
        </div>
      </section>

      <!-- ── STATS ── -->
      <div class="py-4 flex justify-between items-center text-xs text-gray-500 font-bold uppercase tracking-widest">
        <span>{{ filteredPosts.length }} {{ filteredPosts.length === 1 ? "post" : "posts" }}</span>
      </div>

      <!-- ── POSTS GRID ── -->
      <section id="blog-posts" class="py-12">
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div v-for="i in 4" :key="i" class="glass-card-deep rounded-[40px] p-6 border border-white/5 animate-pulse">
            <div class="aspect-[16/9] rounded-2xl bg-white/5 mb-5"></div>
            <div class="h-4 bg-white/5 rounded w-3/4 mb-3"></div>
            <div class="h-3 bg-white/5 rounded w-full mb-2"></div>
            <div class="h-3 bg-white/5 rounded w-2/3"></div>
          </div>
        </div>

        <div v-else-if="filteredPosts.length === 0" class="text-center py-20">
          <Icon name="ph:newspaper-bold" class="text-6xl text-white/10 mb-6" />
          <p class="text-gray-400 font-bold italic text-xl">No posts found.</p>
          <button @click="selectedCategory = 'all'; searchQuery = ''; fetchPosts()" class="mt-4 text-rungreen text-sm font-black uppercase tracking-widest hover:underline">
            Clear filters
          </button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <NuxtLink
            v-for="(post, i) in filteredPosts"
            :key="post.id"
            :to="`/blog/${post.slug}`"
            :class="[
              'glass-card-deep rounded-[40px] p-6 md:p-8 border border-white/5 group hover:border-rungreen/40 transition-all duration-500 card-animate',
              visibleSections.has('blog-posts') ? 'card-visible' : '',
            ]"
            :style="`--delay: ${i * 100}ms`"
          >
            <!-- Image -->
            <div class="aspect-[16/9] rounded-2xl overflow-hidden mb-5 bg-white/[0.02] relative border border-white/5">
              <img
                v-if="post.featured_image"
                :src="post.featured_image"
                :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-white/5">
                <Icon name="ph:image-bold" class="text-5xl" />
              </div>
              <span class="absolute top-4 left-4 bg-rungreen/90 text-black text-[8px] font-black px-3 py-1.5 uppercase rounded-md tracking-widest">
                {{ post.category || 'Circuit' }}
              </span>
              <span class="absolute bottom-4 right-4 bg-black/60 backdrop-blur text-white text-[8px] font-black px-3 py-1.5 uppercase rounded-md tracking-widest">
                {{ post.read_time || 3 }} min read
              </span>
            </div>

            <!-- Meta -->
            <div class="flex items-center gap-3 mb-3 text-[9px] font-black uppercase tracking-widest text-gray-500">
              <span>{{ formatDate(post.created_at) }}</span>
              <span class="w-1 h-1 rounded-full bg-white/20"></span>
              <span>{{ post.views || 0 }} views</span>
            </div>

            <!-- Title -->
            <h3 class="text-xl md:text-2xl font-black italic uppercase tracking-tighter font-['Poppins'] text-white group-hover:text-rungreen transition-colors leading-tight mb-2">
              {{ post.title }}
            </h3>

            <!-- Author -->
            <div v-if="post.authors" class="flex items-center gap-3 mb-3">
              <img
                v-if="post.authors.avatar"
                :src="post.authors.avatar"
                :alt="post.authors.name"
                class="w-6 h-6 rounded-full object-cover border border-white/10"
              />
              <div v-else class="w-6 h-6 rounded-full bg-rungreen/20 flex items-center justify-center">
                <span class="text-rungreen text-[8px] font-black uppercase">{{ post.authors?.name?.charAt(0) || 'R' }}</span>
              </div>
              <span class="text-gray-500 text-[10px] font-bold italic">{{ post.authors?.name || 'Run Go Run' }}</span>
            </div>

            <!-- Content preview -->
            <p class="text-gray-400 text-sm font-bold italic leading-relaxed mb-4">
              {{ truncate(post.content) }}
            </p>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="tag in post.post_tags"
                :key="tag.tags.slug"
                class="text-[7px] font-black uppercase tracking-widest text-rungreen/60 border border-rungreen/10 px-3 py-1 rounded-full"
              >
                #{{ tag.tags.slug }}
              </span>
            </div>

            <div class="flex items-center gap-3 text-rungreen font-black uppercase tracking-widest text-[9px] group-hover:gap-5 transition-all">
              <span>Read Full Circuit</span>
              <Icon name="ph:arrow-right-bold" class="text-sm" />
            </div>
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.glass-card-deep {
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
  backdrop-filter: blur(80px);
}

.text-shadow-glow {
  text-shadow: 0 0 60px rgba(223, 255, 0, 0.45);
}

.card-animate {
  opacity: 0;
  transform: translateY(90px) rotate(-3deg) scale(0.95);
  transition: opacity 0.65s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--delay, 0ms);
}

.card-visible {
  opacity: 1;
  transform: translateY(0) rotate(0deg) scale(1);
}
</style>