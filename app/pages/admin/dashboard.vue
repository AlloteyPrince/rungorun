<!-- pages/admin/dashboard.vue -->
<script setup>
definePageMeta({
  layout: 'admin'
})

import { ref, onMounted, computed } from "vue";
import { supabase } from "../../lib/supabase";

const posts = ref([]);
const totalPosts = ref(0);
const totalViews = ref(0);
const totalComments = ref(0);
const pendingComments = ref(0);
const totalLikes = ref(0);
const recentPosts = ref([]);
const viewsByDay = ref([]);
const loading = ref(true);

const fetchStats = async () => {
  loading.value = true;
  try {
    // Get all posts
    const { data: postsData } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    posts.value = postsData || [];
    totalPosts.value = postsData?.length || 0;
    recentPosts.value = postsData?.slice(0, 5) || [];

    // Calculate total views
    totalViews.value = postsData?.reduce((sum, p) => sum + (p.views || 0), 0) || 0;

    // Calculate total likes
    totalLikes.value = postsData?.reduce((sum, p) => sum + (p.likes || 0), 0) || 0;

    // Get comments
    const { data: commentsData } = await supabase
      .from("comments")
      .select("approved");
    totalComments.value = commentsData?.length || 0;
    pendingComments.value = commentsData?.filter(c => !c.approved).length || 0;

    // Get views by day (last 7 days)
    const { data: viewsData } = await supabase
      .from("page_views")
      .select("viewed_at")
      .gte("viewed_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (viewsData) {
      const days = {};
      viewsData.forEach(v => {
        const day = new Date(v.viewed_at).toLocaleDateString("en-GB", { weekday: "short" });
        days[day] = (days[day] || 0) + 1;
      });
      viewsByDay.value = Object.entries(days).map(([day, count]) => ({ day, count }));
    }
  } catch (err) {
    console.error("Error fetching stats:", err);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatNumber = (num) => {
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num;
};

onMounted(() => {
  fetchStats();
});
</script>

<template>
  <div class="min-h-screen bg-runblack font-['Urbanist',_sans-serif]">
    <!-- Admin Header -->
    <header class="border-b border-white/5 py-5 px-5 sm:px-8">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <div class="flex items-center gap-6">
          <NuxtLink to="/admin/dashboard" class="text-rungreen font-black italic text-xl font-['Poppins']">
            Run<span class="text-white">Go</span>Run
          </NuxtLink>
          <span class="text-[9px] font-black uppercase tracking-widest text-gray-500 border-l border-white/10 pl-4">
            The Circuit Control
          </span>
        </div>
        <div class="flex items-center gap-4">
          <NuxtLink to="/admin/blog" class="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-rungreen transition-colors">
            Posts
          </NuxtLink>
          <NuxtLink to="/admin/subscribers" class="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-rungreen transition-colors">
            Subscribers
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

    <div class="max-w-7xl mx-auto px-5 sm:px-8 py-10">
      <!-- Stats Grid -->
      <div v-if="!loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        <div class="glass-card-deep rounded-2xl p-5 border border-white/5 text-center">
          <p class="text-3xl font-black italic font-['Poppins'] text-rungreen">{{ formatNumber(totalPosts) }}</p>
          <p class="text-[9px] font-black uppercase tracking-widest text-gray-500 mt-1">Total Posts</p>
        </div>
        <div class="glass-card-deep rounded-2xl p-5 border border-white/5 text-center">
          <p class="text-3xl font-black italic font-['Poppins'] text-white">{{ formatNumber(totalViews) }}</p>
          <p class="text-[9px] font-black uppercase tracking-widest text-gray-500 mt-1">Total Views</p>
        </div>
        <div class="glass-card-deep rounded-2xl p-5 border border-white/5 text-center">
          <p class="text-3xl font-black italic font-['Poppins'] text-rungreen">{{ formatNumber(totalLikes) }}</p>
          <p class="text-[9px] font-black uppercase tracking-widest text-gray-500 mt-1">Total Likes</p>
        </div>
        <div class="glass-card-deep rounded-2xl p-5 border border-white/5 text-center">
          <p class="text-3xl font-black italic font-['Poppins'] text-white">{{ totalComments }}</p>
          <p class="text-[9px] font-black uppercase tracking-widest text-gray-500 mt-1">Comments</p>
          <p v-if="pendingComments > 0" class="text-rungreen text-[8px] font-black uppercase tracking-widest mt-1">
            {{ pendingComments }} pending
          </p>
        </div>
        <div class="glass-card-deep rounded-2xl p-5 border border-white/5 text-center">
          <p class="text-3xl font-black italic font-['Poppins'] text-rungreen">#</p>
          <p class="text-[9px] font-black uppercase tracking-widest text-gray-500 mt-1">Live</p>
        </div>
      </div>

      <!-- Recent Posts -->
      <div class="glass-card-deep rounded-3xl p-6 border border-white/5">
        <h3 class="text-sm font-black italic uppercase font-['Poppins'] text-white mb-4">
          Recent Posts
        </h3>
        <div v-if="loading" class="text-gray-500 text-sm font-bold italic">Loading...</div>
        <div v-else-if="recentPosts.length === 0" class="text-gray-500 text-sm font-bold italic">
          No posts yet. <NuxtLink to="/admin/blog/create" class="text-rungreen hover:underline">Create your first post →</NuxtLink>
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="post in recentPosts"
            :key="post.id"
            class="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors gap-2"
          >
            <div class="flex items-center gap-4">
              <div class="w-2 h-2 rounded-full" :class="post.published ? 'bg-rungreen' : 'bg-gray-500'"></div>
              <span class="text-white font-bold text-sm">{{ post.title }}</span>
              <span class="text-[8px] font-black uppercase tracking-widest text-rungreen">{{ post.category || 'Uncategorized' }}</span>
            </div>
            <div class="flex items-center gap-4 text-xs text-gray-500 font-bold">
              <span>{{ post.views || 0 }} views</span>
              <span>{{ formatDate(post.created_at) }}</span>
              <NuxtLink :to="`/admin/blog/edit/${post.id}`" class="text-rungreen hover:underline text-[10px] uppercase tracking-widest">
                Edit
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NuxtLink
          to="/admin/blog/create"
          class="glass-card-deep rounded-2xl p-5 border border-white/5 text-center hover:border-rungreen/40 transition-all group"
        >
          <Icon name="ph:plus-bold" class="text-rungreen text-2xl mb-2" />
          <p class="text-white font-black uppercase tracking-tighter text-sm group-hover:text-rungreen transition-colors">
            New Post
          </p>
          <p class="text-gray-500 text-[10px] font-bold italic">Add to The Circuit</p>
        </NuxtLink>
        <NuxtLink
          to="/admin/blog?pending=true"
          class="glass-card-deep rounded-2xl p-5 border border-white/5 text-center hover:border-rungreen/40 transition-all group"
        >
          <Icon name="ph:chat-bold" class="text-rungreen text-2xl mb-2" />
          <p class="text-white font-black uppercase tracking-tighter text-sm group-hover:text-rungreen transition-colors">
            Pending Comments
          </p>
          <p v-if="pendingComments > 0" class="text-rungreen text-[10px] font-bold">
            {{ pendingComments }} awaiting approval
          </p>
          <p v-else class="text-gray-500 text-[10px] font-bold italic">All clear</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-card-deep {
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
  backdrop-filter: blur(80px);
}
</style>