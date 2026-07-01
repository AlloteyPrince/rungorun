<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "~/lib/supabase";

const router = useRouter();
const loading = ref(false);
const saving = ref(false);
const error = ref("");
const tags = ref([]);
const selectedTags = ref([]);

const post = ref({
  title: "",
  slug: "",
  content: "",
  category: "",
  featured_image: "",
  published: false,
});

// ── Generate Slug ──
const generateSlug = () => {
  post.value.slug = post.value.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// ── Fetch Tags ──
const fetchTags = async () => {
  const { data } = await supabase.from("tags").select("*").order("name");
  if (data) tags.value = data;
};

// ── Save Post ──
const savePost = async (publish = false) => {
  saving.value = true;
  error.value = "";
  
  try {
    // Get current admin user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Get or create author
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
    };

    let result;
    if (post.value.id) {
      // Update
      result = await supabase
        .from("posts")
        .update(postData)
        .eq("id", post.value.id);
    } else {
      // Insert
      result = await supabase
        .from("posts")
        .insert(postData)
        .select()
        .single();
    }

    if (result.error) throw result.error;

    // Handle tags
    if (selectedTags.value.length > 0 && result.data) {
      const postId = result.data.id;
      // Clear existing tags
      await supabase.from("post_tags").delete().eq("post_id", postId);
      
      // Insert new tags
      const tagInserts = selectedTags.value.map(tagId => ({
        post_id: postId,
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

// ── Image Upload ──
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

onMounted(() => {
  fetchTags();
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
            {{ post.id ? 'Edit Post' : 'New Post' }}
          </span>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="savePost(false)"
            :disabled="saving"
            class="px-5 py-2 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:border-white/30 transition-all disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            @click="savePost(true)"
            :disabled="saving"
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
      <div v-if="error" class="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold italic">
        {{ error }}
      </div>

      <!-- Form -->
      <div class="space-y-6">
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
          <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
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
              Upload Image
            </label>
            <span v-if="post.featured_image" class="text-gray-500 text-xs font-bold italic truncate max-w-xs">
              {{ post.featured_image }}
            </span>
          </div>
          <img
            v-if="post.featured_image"
            :src="post.featured_image"
            alt="Featured"
            class="mt-4 max-h-48 rounded-2xl object-cover border border-white/5"
          />
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
      </div>
    </div>
  </div>
</template>