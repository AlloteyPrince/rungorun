// composables/useSiteSettings.ts
import { supabase } from "~/lib/supabase";

const FALLBACK_SETTINGS = {
  id: 1,
  whatsapp_number: "233270751657",
  whatsapp_message:
    "Hello, I am interested in ordering this product from your website.",
  instagram_url: null,
  facebook_url: null,
  tiktok_url: null,
};

export const useSiteSettings = () => {
  return useAsyncData(
    "site-settings",
    async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      return data || FALLBACK_SETTINGS;
    },
    { default: () => FALLBACK_SETTINGS }
  );
};
