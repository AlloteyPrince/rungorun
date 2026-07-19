<script setup>
import { ref, onBeforeUnmount, watch } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { supabase } from "../../lib/supabase";

const props = defineProps({
  modelValue: { type: String, default: "" },
});
const emit = defineEmits(["update:modelValue"]);

const fileInput = ref(null);
const uploading = ref(false);

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
      link: {
        openOnClick: false,
        HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
      },
    }),
    Image,
  ],
  editorProps: {
    attributes: {
      class: "prose prose-invert prose-lg max-w-none focus:outline-none min-h-[320px]",
    },
  },
  onUpdate: ({ editor }) => {
    emit("update:modelValue", editor.getHTML());
  },
});

// Keep the editor in sync if the post is loaded/replaced from outside
// (e.g. fetchPost() populating an existing post after mount).
watch(
  () => props.modelValue,
  (value) => {
    if (!editor.value) return;
    if (value !== editor.value.getHTML()) {
      editor.value.commands.setContent(value || "", { emitUpdate: false });
    }
  }
);

onBeforeUnmount(() => {
  editor.value?.destroy();
});

const isActive = (name, attrs) => editor.value?.isActive(name, attrs) ?? false;

const toggleHeading = (level) => editor.value.chain().focus().toggleHeading({ level }).run();

const setLink = () => {
  const previousUrl = editor.value.getAttributes("link").href;
  const url = window.prompt("Link URL", previousUrl || "https://");
  if (url === null) return;
  if (url === "") {
    editor.value.chain().focus().extendMarkRange("link").unsetLink().run();
    return;
  }
  editor.value.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
};

const triggerImageUpload = () => fileInput.value?.click();

const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  event.target.value = "";
  if (!file) return;

  uploading.value = true;
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `blog/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);

    const alt = window.prompt("Image description (alt text)", "") || "";
    editor.value.chain().focus().setImage({ src: publicUrl, alt }).run();
  } catch (err) {
    alert(err.message || "Image upload failed");
  } finally {
    uploading.value = false;
  }
};
</script>

<template>
  <div class="border border-white/10 rounded-2xl bg-white/5 overflow-hidden">
    <!-- Toolbar -->
    <div v-if="editor" class="flex flex-wrap items-center gap-1 p-2 border-b border-white/10">
      <button
        type="button"
        @click="editor.chain().focus().toggleBold().run()"
        :class="['toolbar-btn', { 'toolbar-btn-active': isActive('bold') }]"
        title="Bold"
      >
        <Icon name="ph:text-b-bold" class="text-lg" />
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleItalic().run()"
        :class="['toolbar-btn', { 'toolbar-btn-active': isActive('italic') }]"
        title="Italic"
      >
        <Icon name="ph:text-italic-bold" class="text-lg" />
      </button>

      <span class="toolbar-divider" />

      <button
        type="button"
        @click="toggleHeading(2)"
        :class="['toolbar-btn', { 'toolbar-btn-active': isActive('heading', { level: 2 }) }]"
        title="Heading 2"
      >
        <Icon name="ph:text-h-two-bold" class="text-lg" />
      </button>
      <button
        type="button"
        @click="toggleHeading(3)"
        :class="['toolbar-btn', { 'toolbar-btn-active': isActive('heading', { level: 3 }) }]"
        title="Heading 3"
      >
        <Icon name="ph:text-h-three-bold" class="text-lg" />
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="['toolbar-btn', { 'toolbar-btn-active': isActive('blockquote') }]"
        title="Quote"
      >
        <Icon name="ph:quotes-bold" class="text-lg" />
      </button>

      <span class="toolbar-divider" />

      <button
        type="button"
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="['toolbar-btn', { 'toolbar-btn-active': isActive('bulletList') }]"
        title="Bullet List"
      >
        <Icon name="ph:list-bullets-bold" class="text-lg" />
      </button>
      <button
        type="button"
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="['toolbar-btn', { 'toolbar-btn-active': isActive('orderedList') }]"
        title="Numbered List"
      >
        <Icon name="ph:list-numbers-bold" class="text-lg" />
      </button>

      <span class="toolbar-divider" />

      <button
        type="button"
        @click="setLink"
        :class="['toolbar-btn', { 'toolbar-btn-active': isActive('link') }]"
        title="Link"
      >
        <Icon name="ph:link-bold" class="text-lg" />
      </button>
      <button
        type="button"
        @click="triggerImageUpload"
        :disabled="uploading"
        class="toolbar-btn disabled:opacity-50"
        title="Image"
      >
        <Icon name="ph:image-bold" class="text-lg" />
      </button>

      <span class="toolbar-divider" />

      <button
        type="button"
        @click="editor.chain().focus().undo().run()"
        class="toolbar-btn"
        title="Undo"
      >
        <Icon name="ph:arrow-u-up-left-bold" class="text-lg" />
      </button>
      <button
        type="button"
        @click="editor.chain().focus().redo().run()"
        class="toolbar-btn"
        title="Redo"
      >
        <Icon name="ph:arrow-u-up-right-bold" class="text-lg" />
      </button>

      <span v-if="uploading" class="text-[10px] font-black uppercase tracking-widest text-rungreen ml-2">
        Uploading...
      </span>
    </div>

    <EditorContent :editor="editor" class="px-5 py-4" />

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleImageUpload"
    />
  </div>
</template>

<style scoped>
.toolbar-btn {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.65rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  background: transparent;
  transition: all 0.2s ease;
}

.toolbar-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.toolbar-btn-active {
  background: #dfff00;
  color: black;
}

.toolbar-btn-active:hover {
  background: #dfff00;
  color: black;
}

.toolbar-divider {
  width: 1px;
  height: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 0.25rem;
}
</style>
