<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { supabase } from "../../lib/supabase";

const route = useRoute();
const post = ref(null);
const loading = ref(true);
const error = ref(null);
const comments = ref([]);
const newComment = ref({ name: "", email: "", content: "" });
const likes = ref(0);
const hasLiked = ref(false);
const relatedPosts = ref([]);
const tocItems = ref([]);

// ── SEO Meta Tags ──
const seoTitle = computed(() => 
  post.value ? `${post.value.title} | The Circuit — Run Go Run` : "The Circuit — Run Go Run Blog"
);

const seoDescription = computed(() => {
  if (!post.value) return "Strategy, sweat, and science from the streets of Accra.";
  // Strip markdown and truncate
  const clean = post.value.content
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[.*?\]\(.*?\)/g, "")
    .replace(/[#*`~_>]/g, "")
    .trim();
  return clean.length > 160 ? clean.slice(0, 157) + "..." : clean;
});

const seoImage = computed(() => 
  post.value?.featured_image || "https://rungorun.store/images/og-image.jpg"
);

const canonicalUrl = computed(() => 
  `https://rungorun.store/blog/${route.params.slug}`
);

// ── UseHead for Meta Tags ──
useHead({
  title: seoTitle,
  meta: [
    { name: "description", content: seoDescription },
    // Open Graph
    { property: "og:title", content: seoTitle },
    { property: "og:description", content: seoDescription },
    { property: "og:image", content: seoImage },
    { property: "og:url", content: canonicalUrl },
    { property: "og:type", content: "article" },
    { property: "og:site_name", content: "Run Go Run" },
    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: seoTitle },
    { name: "twitter:description", content: seoDescription },
    { name: "twitter:image", content: seoImage },
    // Article metadata
    { property: "article:published_time", content: post.value?.published_at },
    { property: "article:author", content: post.value?.authors?.name },
    { property: "article:tag", content: post.value?.post_tags?.map(t => t.tags.name).join(", ") },
  ],
  link: [
    { rel: "canonical", href: canonicalUrl },
  ],
  // Schema.org BlogPosting markup
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.value?.title,
        description: seoDescription.value,
        image: seoImage.value,
        datePublished: post.value?.published_at,
        dateModified: post.value?.updated_at,
        author: {
          "@type": "Person",
          name: post.value?.authors?.name || "Run Go Run",
        },
        publisher: {
          "@type": "Organization",
          name: "Run Go Run",
          logo: {
            "@type": "ImageObject",
            url: "https://rungorun.store/images/logo.png",
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": canonicalUrl.value,
        },
      }),
    },
  ],
});

// ── Fetch Post ──
const fetchPost = async () => {
  loading.value = true;
  try {
    const { data, error: err } = await supabase
      .from("posts")
      .select(`
        *,
        authors:author_id (name, bio, avatar),
        post_tags:post_tags (tags:tag_id (name, slug))
      `)
      .eq("slug", route.params.slug)
      .eq("published", true)
      .single();

    if (err) throw err;
    post.value = data;
    likes.value = data.likes || 0;

    await supabase
      .from("posts")
      .update({ views: (data.views || 0) + 1 })
      .eq("id", data.id);

    await supabase.from("page_views").insert({
      page: `/blog/${data.slug}`,
      post_id: data.id,
      visitor_id: localStorage.getItem("visitor_id") || crypto.randomUUID(),
    });

    await fetchComments();
    await fetchRelatedPosts();

    const visitorId = localStorage.getItem("visitor_id");
    if (visitorId) {
      const { data: likeData } = await supabase
        .from("post_likes")
        .select("id")
        .eq("post_id", data.id)
        .eq("visitor_id", visitorId)
        .maybeSingle();
      hasLiked.value = !!likeData;
    }

    generateTOC(data.content);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// ── Fetch Comments ──
const fetchComments = async () => {
  const { data } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", post.value.id)
    .eq("approved", true)
    .order("created_at", { ascending: false });
  if (data) comments.value = data;
};

// ── Fetch Related Posts ──
const fetchRelatedPosts = async () => {
  const { data } = await supabase
    .from("posts")
    .select("slug, title, featured_image, category")
    .eq("published", true)
    .neq("id", post.value.id)
    .eq("category", post.value.category)
    .limit(3);
  if (data) relatedPosts.value = data;
};

// ── Submit Comment ──
const submitComment = async () => {
  if (!newComment.value.content.trim()) return;

  const { error: err } = await supabase.from("comments").insert({
    post_id: post.value.id,
    author_name: newComment.value.name || "Anonymous",
    author_email: newComment.value.email || null,
    content: newComment.value.content,
    approved: false,
  });

  if (!err) {
    newComment.value = { name: "", email: "", content: "" };
    alert("Comment submitted for approval!");
  }
};

// ── Toggle Like ──
const toggleLike = async () => {
  const visitorId = localStorage.getItem("visitor_id") || crypto.randomUUID();
  localStorage.setItem("visitor_id", visitorId);

  if (hasLiked.value) {
    await supabase
      .from("post_likes")
      .delete()
      .eq("post_id", post.value.id)
      .eq("visitor_id", visitorId);
    hasLiked.value = false;
    likes.value--;
    await supabase.from("posts").update({ likes: likes.value }).eq("id", post.value.id);
  } else {
    await supabase.from("post_likes").insert({
      post_id: post.value.id,
      visitor_id: visitorId,
    });
    hasLiked.value = true;
    likes.value++;
    await supabase.from("posts").update({ likes: likes.value }).eq("id", post.value.id);
  }
};

// ── Share Functions ──
const shareOn = (platform) => {
  const url = window.location.href;
  const text = post.value.title;
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`,
    email: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`,
  };
  if (platform === "copy") {
    navigator.clipboard.writeText(url);
    alert("Link copied!");
    return;
  }
  if (shareUrls[platform]) window.open(shareUrls[platform], "_blank");
};

// ── Table of Contents ──
const generateTOC = (content) => {
  if (!content) return;
  const headings = content.match(/^#{2,3}\s.+$/gm) || [];
  tocItems.value = headings.map((h) => {
    const level = h.startsWith("###") ? 3 : 2;
    const text = h.replace(/^#{2,3}\s/, "");
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return { level, text, id };
  });
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const renderContent = (content) => {
  if (!content) return "";
  let html = content;
  html = html.replace(/^### (.*$)/gim, '<h3 id="$1">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 id="$1">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 id="$1">$1</h1>');
  html = html.replace(/^(?!<h[1-3]|<\/?[uo]l|<\/?li|<\/?blockquote|<\/?br)(.+)$/gim, "<p>$1</p>");
  html = html.replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>");
  html = html.replace(/^- (.*$)/gim, "<li>$1</li>");
  return html;
};

onMounted(() => {
  fetchPost();
});
</script>

<template>
  <div class="bg-runblack text-white min-h-screen font-['Urbanist',_sans-serif]">
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
      <div class="text-rungreen text-sm font-black uppercase tracking-widest animate-pulse">
        Loading Circuit...
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex flex-col items-center justify-center min-h-[60vh] px-5">
      <Icon name="ph:warning-bold" class="text-6xl text-rungreen/30 mb-6" />
      <p class="text-gray-400 font-bold italic text-xl">Post not found.</p>
      <NuxtLink to="/blog" class="mt-6 text-rungreen hover:underline font-bold">
        ← Back to The Circuit
      </NuxtLink>
    </div>

    <!-- Post -->
    <div v-else-if="post">
      <!-- Hero -->
      <section class="relative min-h-[50vh] flex items-center overflow-hidden border-b border-white/5">
        <div class="absolute inset-0 z-0">
          <div class="absolute inset-0 bg-gradient-to-b from-runblack/40 via-runblack/60 to-runblack z-10"></div>
          <img
            :src="post.featured_image || '/images/blog-hero.jpg'"
            class="w-full h-full object-cover opacity-30 pointer-events-none"
            :alt="post.title"
          />
        </div>
        <div class="container mx-auto px-5 sm:px-6 max-w-4xl relative z-20 py-20">
          <div class="flex items-center gap-4 mb-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
            <span class="text-rungreen">{{ post.category || 'Circuit' }}</span>
            <span class="w-1 h-1 rounded-full bg-white/20"></span>
            <span>{{ formatDate(post.created_at) }}</span>
            <span class="w-1 h-1 rounded-full bg-white/20"></span>
            <span>{{ post.read_time || 3 }} min read</span>
          </div>
          <h1 class="text-[clamp(2.5rem,8vw,5rem)] font-black italic uppercase tracking-tighter leading-[0.9] font-['Poppins'] text-white">
            {{ post.title }}
          </h1>
          <!-- Author -->
          <div v-if="post.authors" class="flex items-center gap-4 mt-6">
            <img
              v-if="post.authors.avatar"
              :src="post.authors.avatar"
              :alt="post.authors.name"
              class="w-12 h-12 rounded-full object-cover border-2 border-rungreen/30"
            />
            <div v-else class="w-12 h-12 rounded-full bg-rungreen/20 flex items-center justify-center border-2 border-rungreen/30">
              <span class="text-rungreen text-xl font-black uppercase">{{ post.authors.name?.charAt(0) || 'R' }}</span>
            </div>
            <div>
              <p class="text-white font-black uppercase tracking-tighter">{{ post.authors.name }}</p>
              <p v-if="post.authors.bio" class="text-gray-400 text-sm font-bold italic">{{ post.authors.bio }}</p>
            </div>
          </div>
        </div>
      </section>

      <div class="container mx-auto px-5 sm:px-6 max-w-6xl">
        <div class="flex flex-col lg:flex-row gap-12 py-16">
          <!-- ── TABLE OF CONTENTS ── -->
          <aside v-if="tocItems.length > 0" class="lg:w-72 flex-shrink-0">
            <div class="sticky top-8 glass-card-deep rounded-3xl p-6 border border-white/5">
              <p class="text-[10px] font-black uppercase tracking-widest text-rungreen mb-4">In This Circuit</p>
              <ul class="space-y-2">
                <li
                  v-for="item in tocItems"
                  :key="item.id"
                  :style="`padding-left: ${(item.level - 2) * 16}px`"
                >
                  <a
                    :href="`#${item.id}`"
                    class="text-xs font-bold text-gray-400 hover:text-rungreen transition-colors block"
                  >
                    {{ item.text }}
                  </a>
                </li>
              </ul>
            </div>
          </aside>

          <!-- ── CONTENT ── -->
          <div class="flex-1 min-w-0">
            <div class="prose prose-invert prose-lg max-w-none">
              <div v-html="renderContent(post.content)" class="text-gray-200 leading-relaxed"></div>
            </div>

            <!-- Tags -->
            <div v-if="post.post_tags?.length" class="flex flex-wrap gap-2 mt-8 pt-8 border-t border-white/5">
              <span
                v-for="tag in post.post_tags"
                :key="tag.tags.slug"
                class="text-[9px] font-black uppercase tracking-widest text-rungreen/60 border border-rungreen/20 px-4 py-2 rounded-full"
              >
                #{{ tag.tags.name }}
              </span>
            </div>

            <!-- ── LIKES & SHARE ── -->
            <div class="flex flex-wrap items-center gap-6 mt-8 pt-8 border-t border-white/5">
              <button
                @click="toggleLike"
                class="flex items-center gap-2 px-6 py-3 rounded-full border transition-all"
                :class="[
                  hasLiked
                    ? 'border-rungreen bg-rungreen/10 text-rungreen'
                    : 'border-white/10 hover:border-rungreen/40'
                ]"
              >
                <Icon :name="hasLiked ? 'ph:heart-fill' : 'ph:heart-bold'" class="text-xl" />
                <span class="font-black text-sm">{{ likes }}</span>
              </button>

              <div class="flex items-center gap-2">
                <span class="text-[9px] font-black uppercase tracking-widest text-gray-500">Share</span>
                <button
                  v-for="platform in ['twitter', 'facebook', 'whatsapp', 'linkedin', 'copy']"
                  :key="platform"
                  @click="shareOn(platform)"
                  class="w-10 h-10 rounded-full border border-white/10 hover:border-rungreen/40 hover:bg-rungreen/10 transition-all flex items-center justify-center"
                >
                  <Icon :name="`ph:${platform}-logo-bold`" v-if="platform !== 'copy'" class="text-sm" />
                  <Icon name="ph:copy-bold" v-else class="text-sm" />
                </button>
              </div>
            </div>

            <!-- ── COMMENTS ── -->
            <div class="mt-12 pt-8 border-t border-white/5">
              <h3 class="text-xl font-black italic uppercase font-['Poppins'] mb-6">
                Comments <span class="text-gray-500">({{ comments.length }})</span>
              </h3>

              <!-- Comment Form -->
              <div class="glass-card-deep rounded-3xl p-6 border border-white/5 mb-8">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <input
                    v-model="newComment.name"
                    placeholder="Your name"
                    class="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 text-sm font-bold focus:outline-none focus:border-rungreen/50"
                  />
                  <input
                    v-model="newComment.email"
                    placeholder="Email (optional)"
                    class="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 text-sm font-bold focus:outline-none focus:border-rungreen/50"
                  />
                </div>
                <textarea
                  v-model="newComment.content"
                  placeholder="Share your thoughts..."
                  rows="4"
                  class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 text-sm font-bold focus:outline-none focus:border-rungreen/50 resize-none"
                ></textarea>
                <button
                  @click="submitComment"
                  class="mt-4 px-8 py-3 bg-rungreen text-black rounded-xl font-black uppercase italic text-xs tracking-widest hover:bg-rungreen/80 transition-all"
                >
                  Post Comment
                </button>
              </div>

              <!-- Comments List -->
              <div v-if="comments.length === 0" class="text-gray-500 text-sm font-bold italic">
                No comments yet. Be the first!
              </div>
              <div v-else class="space-y-4">
                <div
                  v-for="comment in comments"
                  :key="comment.id"
                  class="glass-card-deep rounded-2xl p-5 border border-white/5"
                >
                  <div class="flex items-center gap-3 mb-2">
                    <div class="w-8 h-8 rounded-full bg-rungreen/20 flex items-center justify-center">
                      <span class="text-rungreen text-xs font-black uppercase">{{ comment.author_name.charAt(0) }}</span>
                    </div>
                    <span class="font-black uppercase tracking-tighter text-sm">{{ comment.author_name }}</span>
                    <span class="text-gray-500 text-[10px] font-bold">{{ formatDate(comment.created_at) }}</span>
                  </div>
                  <p class="text-gray-300 text-sm font-bold italic leading-relaxed">{{ comment.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── RELATED POSTS ── -->
        <section v-if="relatedPosts.length > 0" class="py-16 border-t border-white/5">
          <h3 class="text-xl font-black italic uppercase font-['Poppins'] mb-8">
            Related <span class="text-rungreen">Circuits</span>
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <NuxtLink
              v-for="post in relatedPosts"
              :key="post.slug"
              :to="`/blog/${post.slug}`"
              class="glass-card-deep rounded-3xl p-5 border border-white/5 hover:border-rungreen/40 transition-all group"
            >
              <div class="aspect-[16/9] rounded-xl overflow-hidden bg-white/5 mb-3">
                <img
                  v-if="post.featured_image"
                  :src="post.featured_image"
                  :alt="post.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-white/5">
                  <Icon name="ph:image-bold" class="text-3xl" />
                </div>
              </div>
              <p class="text-[8px] font-black uppercase tracking-widest text-rungreen">{{ post.category }}</p>
              <h4 class="text-sm font-black italic uppercase font-['Poppins'] text-white group-hover:text-rungreen transition-colors leading-tight">
                {{ post.title }}
              </h4>
            </NuxtLink>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass-card-deep {
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
  backdrop-filter: blur(80px);
}

.prose h1,
.prose h2,
.prose h3 {
  font-family: 'Poppins', sans-serif;
  font-weight: 900;
  font-style: italic;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  color: white;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
}

.prose h1 { font-size: 2.5rem; }
.prose h2 { font-size: 1.8rem; }
.prose h3 { font-size: 1.3rem; }

.prose p {
  color: #d1d5db;
  font-weight: 700;
  font-style: italic;
  line-height: 1.8;
  margin-bottom: 1.5rem;
}

.prose blockquote {
  border-left: 4px solid #dfff00;
  padding-left: 1.5rem;
  margin: 2rem 0;
  color: #9ca3af;
  font-weight: 700;
  font-style: italic;
}

.prose ul,
.prose ol {
  color: #d1d5db;
  font-weight: 700;
  font-style: italic;
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
}

.prose li {
  margin-bottom: 0.5rem;
}

.prose img {
  border-radius: 24px;
  margin: 2rem 0;
  border: 1px solid rgba(255, 255, 255, 0.05);
}
</style>