// composables/useProducts.ts
import { supabase } from "~/lib/supabase";

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  description: string;
  images: string[];
  sizing: "standard" | "sized";
  sizes?: string[];
  specs: ProductSpec[];
  published?: boolean;
  sort_order?: number;
}

// All published products, most recently updated first — used by the
// homepage (featured) and the /categories inventory page.
export const useProducts = () => {
  return useAsyncData<Product[]>(
    "products-published",
    async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("published", true)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    { default: () => [] }
  );
};

// A single published product by id — used by the product detail page.
export const useProduct = (id: MaybeRefOrGetter<string>) => {
  return useAsyncData<Product | null>(
    () => `product-${toValue(id)}`,
    async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", toValue(id))
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    { watch: [() => toValue(id)], default: () => null }
  );
};
