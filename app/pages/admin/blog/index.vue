<!-- pages/admin/blog/index.vue -->
<script setup>
import { ref, onMounted, computed, watch } from "vue";

const posts = ref([]);
const loading = ref(true);
const showPublished = ref(null); // null = all, true = published, false = drafts
const searchQuery = ref("");
const visibleCount = ref(6); // Start with 6 posts
const showSearch = ref(false);
const searchInput = ref(null);

// ── Fetch Posts ──
const fetchPosts = async () => {
  loading.value = true;
  try {
    let query = supabase
      .from("posts")
      .select(`
        *,
        authors:author_id (name, avatar)
      `)
      .order("created_at", { ascending: false });

    if (showPublished.value !== null) {
      query = query.eq("published", showPublished.value);
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
  
  // Apply search filter
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.slug?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.content?.toLowerCase().includes(q)
    );
  }
  
  return result;
});

// ── Visible Posts (pagination) ──
const visiblePosts = computed(() => {
  return filteredPosts.value.slice(0, visibleCount.value);
});

// ── Check if more posts available ──
const hasMorePosts = computed(() => {
  return visibleCount.value < filteredPosts.value.length;
});

// ── Load More Posts ──
const loadMore = () => {
  visibleCount.value += 3; // Load 3 more each time
};

// ── Reset pagination when filters change ──
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

// ── Clear Search ──
const clearSearch = () => {
  searchQuery.value = "";
  resetPagination();
  searchInput.value?.focus();
};

// ── Toggle Publish ──
const togglePublish = async (post) => {
  const newStatus = !post.published;
  const { error } = await supabase
    .from("posts")
    .update({ 
      published: newStatus,
      published_at: newStatus ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    })
    .eq("id", post.id);
  
  if (!error) {
    post.published = newStatus;
    post.published_at = newStatus ? new Date().toISOString() : null;
  }
};

// ── Delete Post ──
const deletePost = async (id, title) => {
  if (!confirm(`Delete "${title}" permanently? This cannot be undone.`)) return;
  
  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id);
  
  if (!error) {
    await fetchPosts();
    resetPagination();
  }
};

// ── Format Date ──
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// ── Count Stats ──
const stats = computed(() => {
  const total = posts.value.length;
  const published = posts.value.filter(p => p.published).length;
  const drafts = total - published;
  return { total, published, drafts };
});

// ── Watch for filter changes ──
watch(showPublished, () => {
  resetPagination();
  fetchPosts();
});

onMounted(() => {
  fetchPosts();
});
</script>

<template>
  <div class="min-h-screen bg-runblack font-['Urbanist',_sans-serif]">
    <!-- Header -->
    <header class="border-b border-white/5 py-4 px-5 sm:px-8 sticky top-0 bg-runblack/80 backdrop-blur z-50">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div class="flex items-center gap-6">
          <NuxtLink to="/admin/dashboard" class="text-rungreen font-black italic text-xl font-['Poppins']">
            Run<span class="text-white">Go</span>Run
          </NuxtLink>
          <span class="text-[9px] font-black uppercase tracking-widest text-gray-500 border-l border-white/10 pl-4 hidden sm:inline">
            Manage Posts
          </span>
        </div>
        <div class="flex items-center gap-3 flex-wrap">
          <NuxtLink 
            to="/admin/blog/create" 
            class="px-5 py-2.5 bg-rungreen text-black rounded-xl font-black uppercase italic text-[10px] tracking-widest hover:bg-rungreen/80 transition-all"
          >
            + New Post
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
          <p class="text-[8px] font-black uppercase tracking-widest text-gray-500">Published</p>
        </div>
        <div class="glass-card-deep rounded-2xl p-4 text-center border border-white/5">
          <p class="text-2xl font-black italic font-['Poppins'] text-gray-400">{{ stats.drafts }}</p>
          <p class="text-[8px] font-black uppercase tracking-widest text-gray-500">Drafts</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div class="flex flex-wrap gap-2">
          <button
            @click="showPublished = null; resetPagination()"
            :class="[
              'px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all',
              showPublished === null 
                ? 'bg-rungreen text-black' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            ]"
          >
            All ({{ stats.total }})
          </button>
          <button
            @click="showPublished = true; resetPagination()"
            :class="[
              'px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all',
              showPublished === true 
                ? 'bg-rungreen text-black' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            ]"
          >
            Published ({{ stats.published }})
          </button>
          <button
            @click="showPublished = false; resetPagination()"
            :class="[
              'px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all',
              showPublished === false 
                ? 'bg-rungreen text-black' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            ]"
          >
            Drafts ({{ stats.drafts }})
          </button>
        </div>

        <!-- ── SEARCH BUTTON / BAR ── -->
        <div class="flex items-center gap-3 w-full sm:w-auto ml-auto">
          <!-- Expanded Search Bar -->
          <div 
            class="relative overflow-hidden transition-all duration-400 ease-in-out"
            :class="showSearch ? 'w-full sm:w-64 opacity-100' : 'w-0 opacity-0'"
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

          <!-- Search Toggle Button -->
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
      </div>

      <!-- Posts Table -->
      <div class="glass-card-deep rounded-3xl border border-white/5 overflow-hidden">
        <!-- Loading -->
        <div v-if="loading" class="p-12 text-center">
          <div class="text-rungreen text-sm font-black uppercase tracking-widest animate-pulse">
            Loading posts...
          </div>
        </div>

        <!-- Empty -->
        <div v-else-if="filteredPosts.length === 0" class="p-12 text-center">
          <Icon name="ph:newspaper-bold" class="text-5xl text-white/10 mb-4" />
          <p class="text-gray-500 font-bold italic">No posts found.</p>
          <button
            v-if="searchQuery || showPublished !== null"
            @click="searchQuery = ''; showPublished = null; resetPagination(); fetchPosts()"
            class="inline-block mt-4 text-rungreen font-black uppercase tracking-widest text-sm hover:underline"
          >
            Clear all filters
          </button>
          <NuxtLink 
            v-else
            to="/admin/blog/create" 
            class="inline-block mt-4 text-rungreen font-black uppercase tracking-widest text-sm hover:underline"
          >
            Create your first post →
          </NuxtLink>
        </div>

        <!-- Table -->
        <div v-else>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="border-b border-white/5 bg-white/5">
                <tr>
                  <th class="px-5 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500 w-12">Status</th>
                  <th class="px-5 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500">Title</th>
                  <th class="px-5 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500 hidden sm:table-cell">Category</th>
                  <th class="px-5 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500 hidden md:table-cell">Views</th>
                  <th class="px-5 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500 hidden lg:table-cell">Date</th>
                  <th class="px-5 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <tr 
                  v-for="post in visiblePosts" 
                  :key="post.id" 
                  class="hover:bg-white/5 transition-colors group"
                >
                  <!-- Status -->
                  <td class="px-5 py-4">
                    <button
                      @click="togglePublish(post)"
                      class="relative w-10 h-6 rounded-full transition-all duration-300 focus:outline-none"
                      :class="post.published ? 'bg-rungreen' : 'bg-gray-600'"
                    >
                      <span 
                        class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-lg transition-transform duration-300"
                        :class="post.published ? 'translate-x-4' : 'translate-x-0'"
                      ></span>
                      <span class="sr-only">{{ post.published ? 'Published' : 'Draft' }}</span>
                    </button>
                  </td>

                  <!-- Title -->
                  <td class="px-5 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-white/5 border border-white/5">
                        <img 
                          v-if="post.featured_image" 
                          :src="post.featured_image" 
                          :alt="post.title"
                          class="w-full h-full object-cover"
                        />
                        <div v-else class="w-full h-full flex items-center justify-center text-white/10">
                          <Icon name="ph:image-bold" class="text-sm" />
                        </div>
                      </div>
                      <div>
                        <NuxtLink 
                          :to="`/blog/${post.slug}`" 
                          target="_blank" 
                          class="text-white font-bold text-sm hover:text-rungreen transition-colors line-clamp-1"
                        >
                          {{ post.title }}
                        </NuxtLink>
                        <span class="text-gray-500 text-[9px] font-mono block sm:hidden">
                          /{{ post.slug }}
                        </span>
                      </div>
                    </div>
                  </td>

                  <!-- Category -->
                  <td class="px-5 py-4 hidden sm:table-cell">
                    <span 
                      v-if="post.category" 
                      class="text-[8px] font-black uppercase tracking-widest text-rungreen bg-rungreen/10 px-3 py-1.5 rounded-full"
                    >
                      {{ post.category }}
                    </span>
                    <span v-else class="text-gray-600 text-[9px] italic">—</span>
                  </td>

                  <!-- Views -->
                  <td class="px-5 py-4 hidden md:table-cell">
                    <span class="text-gray-400 text-sm font-bold">{{ post.views || 0 }}</span>
                  </td>

                  <!-- Date -->
                  <td class="px-5 py-4 hidden lg:table-cell">
                    <span class="text-gray-500 text-xs font-bold">{{ formatDate(post.created_at) }}</span>
                  </td>

                  <!-- Actions -->
                  <td class="px-5 py-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <NuxtLink
                        :to="`/admin/blog/${post.id}`"
                        class="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-rungreen transition-colors"
                      >
                        Edit
                      </NuxtLink>
                      <span class="text-white/5">|</span>
                      <button
                        @click="deletePost(post.id, post.title)"
                        class="text-[9px] font-black uppercase tracking-widest text-red-400/40 hover:text-red-400 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- ── LOAD MORE BUTTON (Admin) ── -->
          <div v-if="hasMorePosts" class="flex justify-center py-6 border-t border-white/5">
            <button
              @click="loadMore"
              class="group px-8 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-rungreen hover:text-black transition-all duration-500"
            >
              <span class="font-black uppercase italic text-[10px] tracking-widest flex items-center gap-3">
                Load More Posts
                <Icon name="ph:caret-down-bold" class="text-sm group-hover:translate-y-1 transition-transform" />
              </span>
            </button>
          </div>

          <!-- Showing count -->
          <div class="px-5 py-3 border-t border-white/5 text-center text-[9px] font-black uppercase tracking-widest text-gray-500">
            Showing {{ visiblePosts.length }} of {{ filteredPosts.length }} posts
            <span v-if="searchQuery" class="text-rungreen ml-2">
              — filtered by "{{ searchQuery }}"
            </span>
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

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.duration-400 {
  transition-duration: 400ms;
}
</style>