// app/data/products.ts
// ─────────────────────────────────────────────
// Central product data file.
// Edit ONLY this file to add, remove, or update products.
// Both the category page and product detail page pull from here.
// ─────────────────────────────────────────────

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  system: string;
  description: string;
  images: string[]; // images[0] = main image & WhatsApp card, images[1-3] = thumbnails
  sizing: "standard" | "sized";
  sizes?: string[]; // only needed when sizing is 'sized'
  specs: ProductSpec[];
}

export const products: Product[] = [
  {
    id: "premium-armband-1",
    name: "Premium Arm Band",
    price: "120.00",
    category: "Accessories",
    system: "SYS.01",
    description:
      "Precision-engineered for the Accra climate. Features targeted tension zones for optimal oxygenation and moisture management.",
    images: [
      "/images/armbandimg1.jpg", // Main image — used for WhatsApp card
      "/images/armbandimg1b.jpg", // Thumbnail 2
      "/images/armbandimg1c.jpg", // Thumbnail 3
      "/images/armbandimg1d.jpg", // Thumbnail 4
    ],
    sizing: "standard",
    specs: [
      { label: "Formulation", value: "Performance Textile" },
      { label: "Origin", value: "Accra Active Circuit" },
      { label: "Climate", value: "High Humidity Optimized" },
      { label: "Safety", value: "Clinical Grade" },
    ],
  },
  {
    id: "premium-chest-band-2",
    name: "Premium Chest Band",
    price: "200.00",
    category: "Accessories",
    system: "SYS.02",
    description:
      "Precision-engineered for the Accra climate. Features targeted tension zones for optimal oxygenation and moisture management.",
    images: [
      "/images/armbandimg2.jpg", // Main image — used for WhatsApp card
      "/images/armbandimg2b.jpg", // Thumbnail 2
      "/images/armbandimg2c.jpg", // Thumbnail 3
      "/images/armbandimg2d.jpg", // Thumbnail 4
    ],
    sizing: "standard",
    specs: [
      { label: "Formulation", value: "Performance Textile" },
      { label: "Origin", value: "Accra Active Circuit" },
      { label: "Climate", value: "High Humidity Optimized" },
      { label: "Safety", value: "Clinical Grade" },
    ],
  },
];

// Helper — used by the product detail page
export const getProductById = (id: string): Product | undefined => {
  return products.find((p) => p.id === id);
};
