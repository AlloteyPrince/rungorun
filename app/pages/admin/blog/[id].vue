<!-- pages/admin/blog/[id].vue -->
<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const loading = ref(true);
const saving = ref(false);
const error = ref("");
const tags = ref([]);
const selectedTags = ref([]);
const postId = route.params.id; // ✅ Nuxt automatically gives us this

const post = ref({
  id: "",
  title: "",
  slug: "",
  content: "",
  category: "",
  featured_image: "",
  published: false,
});

// ── Fetch Post ──
const fetchPost = async () => {
  loading.value = true;
  try {
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .select(`
        *,
        post_tags:post_tags (tag_id)
      `)
      .eq("id", postId)
      .single();

    if (postError) throw postError;
    
    post.value = {
      id: postData.id,
      title: postData.title || "",
      slug: postData.slug || "",
      content: postData.content || "",
      category: postData.category || "",
      featured_image: postData.featured_image || "",
      published: postData.published || false,
    };

    if (postData.post_tags) {
      selectedTags.value = postData.post_tags.map(pt => pt.tag_id);
    }

    const { data: tagsData } = await supabase
      .from("tags")
      .select("*")
      .order("name");
    if (tagsData) tags.value = tagsData;

  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const generateSlug = () => {
  post.value.slug = post.value.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const savePost = async (publish = false) => {
  saving.value = true;
  error.value = "";
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    let { data: author } = await supabase
      .from("authors")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!author) {
      const { data: newAuthor } = await supabase
        .from("authors")
        .insert({
          user_id: user.id,
          name: "Admin",
        })
        .select()
        .single();
      author = newAuthor;
    }

    const postData = {
      title: post.value.title,
      slug: post.value.slug,
      content: post.value.content,
      category: post.value.category,
      featured_image: post.value.featured_image,
      author_id: author.id,
      published: publish,
      published_at: publish ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabase
      .from("posts")
      .update(postData)
      .eq("id", post.value.id);

    if (updateError) throw updateError;

    await supabase.from("post_tags").delete().eq("post_id", post.value.id);
    
    if (selectedTags.value.length > 0) {
      const tagInserts = selectedTags.value.map(tagId => ({
        post_id: post.value.id,
        tag_id: tagId,
      }));
      await supabase.from("post_tags").insert(tagInserts);
    }

    router.push("/admin/blog");
  } catch (err) {
    error.value = err.message;
  } finally {
    saving.value = false;
  }
};

const deletePost = async () => {
  if (!confirm("Delete this post permanently? This cannot be undone.")) return;
  
  saving.value = true;
  try {
    const { error: deleteError } = await supabase
      .from("posts")
      .delete()
      .eq("id", post.value.id);
    
    if (deleteError) throw deleteError;
    router.push("/admin/blog");
  } catch (err) {
    error.value = err.message;
  } finally {
    saving.value = false;
  }
};

const uploadImage = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `blog/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("images")
    .upload(filePath, file);

  if (uploadError) {
    error.value = uploadError.message;
    return;
  }

  const { data: { publicUrl } } = supabase.storage
    .from("images")
    .getPublicUrl(filePath);

  post.value.featured_image = publicUrl;
};

const removeImage = () => {
  post.value.featured_image = "";
};

onMounted(() => {
  fetchPost();
});
</script>

<template>
  <div class="min-h-screen bg-runblack font-['Urbanist',_sans-serif]">
    <!-- Header -->
    <header class="border-b border-white/5 py-4 px-5 sm:px-8">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div class="flex items-center gap-6">
          <NuxtLink to="/admin/dashboard" class="text-rungreen font-black italic text-xl font-['Poppins']">
            Run<span class="text-white">Go</span>Run
          </NuxtLink>
          <span class="text-[9px] font-black uppercase tracking-widest text-gray-500 border-l border-white/10 pl-4">
            Edit Post
          </span>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="deletePost"
            :disabled="saving || loading"
            class="px-5 py-2 border border-red-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-400/60 hover:text-red-400 hover:border-red-500/50 transition-all disabled:opacity-50"
          >
            Delete
          </button>
          <button
            @click="savePost(false)"
            :disabled="saving || loading"
            class="px-5 py-2 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:border-white/30 transition-all disabled:opacity-50"
          >
            {{ saving ? 'Saving...' : 'Save Draft' }}
          </button>
          <button
            @click="savePost(true)"
            :disabled="saving || loading"
            class="px-5 py-2 bg-rungreen text-black rounded-xl font-black uppercase italic text-[10px] tracking-widest hover:bg-rungreen/80 transition-all disabled:opacity-50"
          >
            {{ saving ? 'Saving...' : 'Publish' }}
          </button>
          <button
            @click="supabase.auth.signOut()"
            class="text-[10px] font-black uppercase tracking-widest text-red-400/60 hover:text-red-400 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-5 sm:px-8 py-10">
      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="text-rungreen text-sm font-black uppercase tracking-widest animate-pulse">
          Loading post...
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error && !post.id" class="text-center py-20">
        <Icon name="ph:warning-bold" class="text-6xl text-rungreen/30 mb-6" />
        <p class="text-gray-400 font-bold italic text-xl">Post not found.</p>
        <NuxtLink to="/admin/blog" class="mt-4 inline-block text-rungreen font-black uppercase tracking-widest text-sm hover:underline">
          ← Back to Manage Posts
        </NuxtLink>
      </div>

      <!-- Form -->
      <div v-else class="space-y-6">
        <div v-if="error" class="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold italic">
          {{ error }}
        </div>

        <!-- Status Badge -->
        <div class="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
          <span class="text-[10px] font-black uppercase tracking-widest text-gray-500">Status:</span>
          <span 
            class="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest"
            :class="post.published ? 'bg-rungreen/20 text-rungreen' : 'bg-gray-500/20 text-gray-400'"
          >
            {{ post.published ? 'Published' : 'Draft' }}
          </span>
          <span class="text-gray-500 text-[10px] font-bold italic ml-auto">
            Last updated: {{ new Date().toLocaleDateString() }}
          </span>
        </div>

        <!-- Title -->
        <div>
          <label class="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
            Title
          </label>
          <input
            v-model="post.title"
            @input="generateSlug"
            type="text"
            placeholder="Your post title..."
            class="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 text-lg font-black focus:outline-none focus:border-rungreen/50 transition-all"
          />
        </div>

        <!-- Slug -->
        <div>
          <label class="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
            Slug
          </label>
          <div class="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
            <span class="text-gray-500 text-sm font-bold">rungorun.store/blog/</span>
            <input
              v-model="post.slug"
              type="text"
              placeholder="your-post-slug"
              class="flex-1 bg-transparent text-white text-sm font-bold focus:outline-none"
            />
          </div>
        </div>

        <!-- Category -->
        <div>
          <label class="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
            Category
          </label>
          <input
            v-model="post.category"
            type="text"
            placeholder="e.g., Routes, Gear, Nutrition"
            class="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 text-sm font-bold focus:outline-none focus:border-rungreen/50 transition-all"
          />
        </div>

        <!-- Tags -->
        <div>
          <label class="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
            Tags
          </label>
          <div class="flex flex-wrap gap-2 p-4 bg-white/5 border border-white/10 rounded-2xl">
            <button
              v-for="tag in tags"
              :key="tag.id"
              @click="selectedTags.includes(tag.id) ? selectedTags = selectedTags.filter(t => t !== tag.id) : selectedTags.push(tag.id)"
              :class="[
                'px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all',
                selectedTags.includes(tag.id)
                  ? 'bg-rungreen text-black'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              ]"
            >
              #{{ tag.name }}
            </button>
          </div>
        </div>

        <!-- Featured Image -->
        <div>
          <label class="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
            Featured Image
          </label>
          <div class="flex flex-wrap items-center gap-4">
            <input
              type="file"
              accept="image/*"
              @change="uploadImage"
              class="hidden"
              id="image-upload"
            />
            <label
              for="image-upload"
              class="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:border-white/30 transition-all cursor-pointer"
            >
              Upload New Image
            </label>
            <button
              v-if="post.featured_image"
              @click="removeImage"
              class="px-4 py-2 border border-red-500/30 rounded-xl text-[9px] font-black uppercase tracking-widest text-red-400/60 hover:text-red-400 transition-all"
            >
              Remove
            </button>
          </div>
          <div v-if="post.featured_image" class="mt-4 relative">
            <img
              :src="post.featured_image"
              alt="Featured"
              class="max-h-48 rounded-2xl object-cover border border-white/5"
            />
          </div>
        </div>

        <!-- Content -->
        <div>
          <label class="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
            Content (Markdown)
          </label>
          <textarea
            v-model="post.content"
            rows="20"
            placeholder="Write your post in Markdown..."
            class="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 text-sm font-bold focus:outline-none focus:border-rungreen/50 transition-all font-mono leading-relaxed"
          ></textarea>
          <p class="mt-2 text-gray-500 text-[10px] font-bold italic">
            Supports # Headers, > Blockquotes, - Lists, and ![alt](image-url)
          </p>
        </div>

        <!-- Preview Link -->
        <div v-if="post.slug" class="pt-4 border-t border-white/5">
          <NuxtLink
            :to="`/blog/${post.slug}`"
            target="_blank"
            class="text-rungreen text-sm font-black uppercase tracking-widest hover:underline inline-flex items-center gap-2"
          >
            <Icon name="ph:eye-bold" />
            Preview Post
          </NuxtLink>
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
</style>