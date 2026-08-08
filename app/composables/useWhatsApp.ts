// composables/useWhatsApp.ts
export const useWhatsApp = () => {
  const appConfig = useAppConfig();
  const { data: settings } = useSiteSettings();

  const orderOnWhatsApp = (
    productName: string,
    price: string,
    quantity: number = 1,
    size: string = "M",
    productId: string = "",
  ) => {
    const phone = settings.value.whatsapp_number;
    const total = (parseFloat(price) * quantity).toFixed(2);
    const productUrl = `https://rungorun.store/products/${productId}`;

    const text = `🛒 *NEW ORDER — ${appConfig.brand.name.toUpperCase()}*
━━━━━━━━━━━━━━━
📦 *Product:* ${productName}
📏 *Size:* ${size}
🔢 *Quantity:* ${quantity}
💰 *Unit Price:* GHS ${price}
🧾 *Total:* GHS ${total}
━━━━━━━━━━━━━━━
🔗 *View Product:* ${productUrl}
━━━━━━━━━━━━━━━
${settings.value.whatsapp_message}`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return {
    orderOnWhatsApp,
  };
};