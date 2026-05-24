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
  description: string;
  images: string[]; // images[0] = main image & WhatsApp card, images[1-3] = thumbnails
  sizing: "standard" | "sized";
  sizes?: string[]; // only needed when sizing is 'sized'
  specs: ProductSpec[];
}

export const products: Product[] = [
  {
    id: "premium-armband-1",
    name: "Jogging Arm Band",
    price: "120.00",
    category: "Accessories",
    description:
      "Precision-engineered for the Accra climate. Features targeted tension zones for optimal oxygenation and moisture management.Run free, stay connected. Your phone always secure and within reach!",
    images: [
      "/images/armband1.jpg", // Main image — used for WhatsApp card
      "/images/armband1b.jpg", // Thumbnail 2
      "/images/armband1d.jpg", // Thumbnail 3
      "/images/armband1e.jpg", // Thumbnail 4
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
    id: "premium-running-vest-1",
    name: "Premium Running Vest",
    price: "200.00",
    category: "Accessories",
    description:
      "Precision-engineered for the Accra climate. Features targeted tension zones for optimal oxygenation and moisture management.Secure Grip. No Worries. Adjustable waist buckle. Can be used in running, cycling, jogging and any active performances",
    images: [
      "/images/runningvest1f.jpg", // Main image — used for WhatsApp card
      "/images/runningvest1a.jpg", // Thumbnail 2
      "/images/runningvest1b.jpg", // Thumbnail 3
      "/images/runningvest1e.jpg", // Thumbnail 4
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
