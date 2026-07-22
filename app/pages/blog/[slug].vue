<script setup>
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import DOMPurify from "dompurify";
import { supabase } from "../../lib/supabase";

const route = useRoute();

// ── Fetch Post ──
// useAsyncData runs on the server too, so the first HTML response already
// contains the real post data. That matters for sharing: platforms like
// WhatsApp/Facebook/Twitter/Slack read the og:* tags below straight from the
// raw HTML without running JS, so if this fetch only happened in onMounted
// (client-only), shared links would always show the generic site fallback
// instead of this post's title/image.
const { data: post, pending: loading, error: postError } = await useAsyncData(
  () => `post-${route.params.slug}`,
  async () => {
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
    return data;
  },
  { watch: [() => route.params.slug] }
);
const error = computed(() => postError.value?.message || null);

const comments = ref([]);
const newComment = ref({ name: "", email: "", content: "" });
const likes = ref(0);
const hasLiked = ref(false);
const relatedPosts = ref([]);

watch(post, (val) => { likes.value = val?.likes || 0; }, { immediate: true });

// ── SEO Meta Tags ──
const seoTitle = computed(() => 
  post.value ? `${post.value.title} | The Circuit — Run Go Run` : "The Circuit — Run Go Run Blog"
);

const seoDescription = computed(() => {
  if (!post.value) return "Strategy, sweat, and science from the streets of Accra.";
  const clean = getExcerptText(post.value.content);
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

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// ── Content rendering ──
// isHtmlContent/markdownToHtml/injectHeadingIds/getExcerptText come from
// app/utils/markdown.ts (auto-imported). Legacy posts (plain text/markdown,
// from the old textarea editor) get converted on the fly; posts saved from
// the RichTextEditor are already HTML. injectHeadingIds also stamps ids onto
// headings so direct #anchor links still work even without a visible TOC.
const processedContent = computed(() => {
  if (!post.value?.content) return { html: "", headings: [] };
  return injectHeadingIds(post.value.content);
});

// DOMPurify needs a browser `window`, which doesn't exist server-side —
// this returns "" during SSR and fills in once the client hydrates.
const sanitizedContent = computed(() => {
  if (!import.meta.client || !processedContent.value.html) return "";
  return DOMPurify.sanitize(processedContent.value.html, {
    ALLOWED_TAGS: ["p", "h1", "h2", "h3", "strong", "em", "a", "ul", "ol", "li", "blockquote", "img", "br"],
    ALLOWED_ATTR: ["id", "href", "target", "rel", "src", "alt"],
  });
});

// ── Client-only side effects (view count, comments, related, like status) ──
// Runs once on initial client load and again whenever `post` changes (e.g.
// clicking a related post). Guarded to skip on the server, since it touches
// localStorage and shouldn't count bot/crawler traffic as a view.
watch(
  post,
  async (val) => {
    if (!import.meta.client || !val) return;

    await supabase
      .from("posts")
      .update({ views: (val.views || 0) + 1 })
      .eq("id", val.id);

    await supabase.from("page_views").insert({
      page: `/blog/${val.slug}`,
      post_id: val.id,
      visitor_id: localStorage.getItem("visitor_id") || crypto.randomUUID(),
    });

    await fetchComments();
    await fetchRelatedPosts();

    const visitorId = localStorage.getItem("visitor_id");
    hasLiked.value = false;
    if (visitorId) {
      const { data: likeData } = await supabase
        .from("post_likes")
        .select("id")
        .eq("post_id", val.id)
        .eq("visitor_id", visitorId)
        .maybeSingle();
      hasLiked.value = !!likeData;
    }
  },
  { immediate: true }
);
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
      <section class="relative overflow-hidden">
        <div class="absolute inset-0 z-0">
          <div class="absolute inset-0 bg-gradient-to-b from-runblack/40 via-runblack/60 to-runblack z-10"></div>
          <img
            :src="post.featured_image || '/images/blog-hero.jpg'"
            class="w-full h-full object-cover opacity-30 pointer-events-none"
            :alt="post.title"
          />
        </div>
        <div class="container mx-auto px-5 sm:px-6 max-w-4xl relative z-20 pt-32 pb-8 sm:pb-14">
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
        <div class="pt-6 sm:pt-10 pb-16">
          <!-- ── CONTENT ── -->
          <div class="max-w-3xl mx-auto">
            <div class="prose prose-invert prose-lg max-w-none">
              <div v-html="sanitizedContent" class="text-gray-200 leading-relaxed"></div>
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

    <SubscribeBox source="blog-post" />
  </div>
</template>

<style scoped>
.glass-card-deep {
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
  backdrop-filter: blur(80px);
}
</style>