<!-- app/pages/blog/index.vue -->
<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { supabase } from "../../lib/supabase";
import { SITE_URL } from "~/utils/seo";

useHead({
  title: "The Circuit | Run Go Run Blog — Running Guides & Gear Science for Accra",
  meta: [
    {
      name: "description",
      content:
        "Stories, practical guides, gear science, and runner-tested strategies for Accra. The Run Go Run blog covers training, gear, and active living.",
    },
  ],
  link: [{ rel: "canonical", href: `${SITE_URL}/blog` }],
});

const posts = ref([]);
const loading = ref(true);
const visibleSections = ref(new Set());
const selectedCategory = ref("all");
const searchQuery = ref("");
const categories = ref([]);
const visibleCount = ref(6);
const showSearch = ref(false);
const searchInput = ref(null);

// ── Fetch Categories ──
const fetchCategories = async () => {
  const { data } = await supabase.from("tags").select("*").order("name");
  if (data) categories.value = data;
};

// ── Fetch Posts ──
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

// ── Filtered Posts ──
const filteredPosts = computed(() => {
  let result = posts.value;
  
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.content?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
  }
  
  return result;
});

// ── Visible Posts (pagination) ──
const visiblePosts = computed(() => {
  return filteredPosts.value.slice(0, visibleCount.value);
});

const hasMorePosts = computed(() => {
  return visibleCount.value < filteredPosts.value.length;
});

const loadMore = () => {
  visibleCount.value += 3;
};

const resetPagination = () => {
  visibleCount.value = 6;
};

// ── Toggle Search ──
const toggleSearch = () => {
  showSearch.value = !showSearch.value;
  if (showSearch.value) {
    setTimeout(() => {
      searchInput.value?.focus();
    }, 300);
  } else {
    searchQuery.value = "";
    resetPagination();
  }
};

const clearSearch = () => {
  searchQuery.value = "";
  resetPagination();
  searchInput.value?.focus();
};

// ── Format Helpers ──
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const truncate = (text, length = 140) => {
  if (!text) return "";
  const clean = getExcerptText(text);
  return clean.length > length ? clean.slice(0, length) + "..." : clean;
};

watch(selectedCategory, () => {
  resetPagination();
  fetchPosts();
});

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
    <section 
      id="blog-hero" 
      class="relative min-h-[55vh] md:min-h-[60vh] flex items-center overflow-hidden border-b border-white/5"
    >
      <div class="absolute inset-0 z-0">
        <div class="absolute inset-0 bg-gradient-to-b from-runblack/40 via-runblack/60 to-runblack z-10"></div>
        <img
          src="/images/blog-hero.jpeg"
          class="w-full h-full object-cover opacity-30 pointer-events-none"
          alt="The Circuit"
        />
      </div>
      <div class="container mx-auto px-5 sm:px-6 max-w-6xl relative z-20">
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
          <h1 class="text-[clamp(3rem,10vw,6rem)] font-black italic uppercase tracking-tighter leading-[0.9] font-['Poppins']">
            The <span class="text-rungreen text-shadow-glow">Circuit.</span>
          </h1>
          <p class="text-gray-300 text-base sm:text-lg md:text-xl italic font-bold max-w-2xl border-l-4 border-rungreen pl-5 md:pl-8 leading-tight mt-4">
            Stories, practical guides, gear science, and runner-tested strategies for Accra
          </p>
        </div>
      </div>
    </section>

    <div class="container mx-auto px-5 sm:px-6 max-w-6xl">
      <!-- ── FILTERS BAR ── -->
      <section class="py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5">
        <div class="flex flex-wrap gap-2">
          <button
            @click="selectedCategory = 'all'; resetPagination()"
            :class="[
              'px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all',
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
            @click="selectedCategory = tag.slug; resetPagination()"
            :class="[
              'px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all',
              selectedCategory === tag.slug
                ? 'bg-rungreen text-black'
                : 'bg-white/5 text-white/50 hover:bg-white/10'
            ]"
          >
            {{ tag.name }}
          </button>
        </div>

        <!-- ── SEARCH BUTTON / BAR ── -->
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <div 
            class="relative overflow-hidden transition-all duration-400 ease-in-out"
            :class="showSearch ? 'w-full sm:w-72 opacity-100' : 'w-0 opacity-0'"
          >
            <input
              ref="searchInput"
              v-model="searchQuery"
              @input="resetPagination()"
              type="text"
              placeholder="Search posts..."
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
      </section>

      <!-- ── STATS ── -->
      <div class="py-4 flex justify-between items-center text-xs text-gray-500 font-bold uppercase tracking-widest">
        <span>
          {{ filteredPosts.length }} {{ filteredPosts.length === 1 ? "post" : "posts" }}
          <span v-if="searchQuery" class="text-rungreen ml-2">
            — searching: "{{ searchQuery }}"
          </span>
        </span>
        <span v-if="selectedCategory !== 'all'">
          {{ categories.find(c => c.slug === selectedCategory)?.name }}
        </span>
      </div>

      <!-- ── POSTS GRID ── -->
      <section id="blog-posts" class="py-8">
        <!-- Loading -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="i in 6" :key="i" class="glass-card-deep rounded-[40px] p-6 border border-white/5 animate-pulse">
            <div class="aspect-[16/9] rounded-2xl bg-white/5 mb-5"></div>
            <div class="h-4 bg-white/5 rounded w-3/4 mb-3"></div>
            <div class="h-3 bg-white/5 rounded w-full mb-2"></div>
            <div class="h-3 bg-white/5 rounded w-2/3"></div>
          </div>
        </div>

        <!-- Empty -->
        <div v-else-if="filteredPosts.length === 0" class="text-center py-20">
          <Icon name="ph:newspaper-bold" class="text-6xl text-white/10 mb-6" />
          <p class="text-gray-400 font-bold italic text-xl">No posts found.</p>
          <button 
            v-if="searchQuery || selectedCategory !== 'all'"
            @click="searchQuery = ''; selectedCategory = 'all'; resetPagination(); fetchPosts()" 
            class="mt-4 text-rungreen text-sm font-black uppercase tracking-widest hover:underline"
          >
            Clear all filters
          </button>
        </div>

        <!-- Grid -->
        <div v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <NuxtLink
              v-for="(post, i) in visiblePosts"
              :key="post.id"
              :to="`/blog/${post.slug}`"
              :class="[
                'glass-card-deep rounded-[40px] p-6 md:p-8 border border-white/5 group hover:border-rungreen/40 transition-all duration-500 card-animate',
                visibleSections.has('blog-posts') ? 'card-visible' : '',
              ]"
              :style="`--delay: ${i * 80}ms`"
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
              <p class="text-gray-400 text-sm font-bold italic leading-relaxed mb-4 line-clamp-3">
                {{ truncate(post.content) }}
              </p>

              <!-- Tags -->
              <div class="flex flex-wrap gap-2 mb-4">
                <span
                  v-for="tag in post.post_tags?.slice(0, 3)"
                  :key="tag.tags.slug"
                  class="text-[7px] font-black uppercase tracking-widest text-rungreen/60 border border-rungreen/10 px-3 py-1 rounded-full"
                >
                  #{{ tag.tags.slug }}
                </span>
                <span v-if="post.post_tags?.length > 3" class="text-[7px] font-black uppercase tracking-widest text-gray-500">
                  +{{ post.post_tags.length - 3 }} more
                </span>
              </div>

              <div class="flex items-center gap-3 text-rungreen font-black uppercase tracking-widest text-[9px] group-hover:gap-5 transition-all">
                <span>Read Full Circuit</span>
                <Icon name="ph:arrow-right-bold" class="text-sm" />
              </div>
            </NuxtLink>
          </div>

          <!-- ── LOAD MORE BUTTON ── -->
          <div v-if="hasMorePosts" class="flex justify-center mt-12">
            <button
              @click="loadMore"
              class="group px-10 py-4 bg-white/5 border border-white/10 rounded-full hover:bg-rungreen hover:text-black transition-all duration-500"
            >
              <span class="font-black uppercase italic text-xs tracking-widest flex items-center gap-3">
                Load More Posts
                <Icon name="ph:caret-down-bold" class="text-sm group-hover:translate-y-1 transition-transform" />
              </span>
            </button>
          </div>

          <div v-if="filteredPosts.length > 6" class="text-center mt-4 text-[9px] font-black uppercase tracking-widest text-gray-500">
            Showing {{ visiblePosts.length }} of {{ filteredPosts.length }} posts
          </div>
        </div>
      </section>
    </div>

    <SubscribeBox source="blog" />
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

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.duration-400 {
  transition-duration: 400ms;
}
</style>