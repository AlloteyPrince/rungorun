// composables/useWhatsApp.ts
export const useWhatsApp = () => {
  const appConfig = useAppConfig()

  const orderOnWhatsApp = (
    productName: string,
    price: string,
    quantity: number = 1,
    size: string = 'M'
  ) => {
    const phone = appConfig.brand.whatsappNumber
    const total = (parseFloat(price) * quantity).toFixed(2)
    const productSlug = productName.toLowerCase().replace(/\s+/g, '-')
    const productUrl = `https://rungorun.netlify.app/shop/${productSlug}`

    const text = `🛒 *NEW ORDER — ${appConfig.brand.name.toUpperCase()}*
━━━━━━━━━━━━━━━━━━━━━
📦 *Product:* ${productName}
📏 *Size:* ${size}
🔢 *Quantity:* ${quantity}
💰 *Unit Price:* GHS ${price}
🧾 *Total:* GHS ${total}
━━━━━━━━━━━━━━━━━━━━━
🔗 *View Product:* ${productUrl}
━━━━━━━━━━━━━━━━━━━━━
${appConfig.brand.whatsappMessage}`

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  return {
    orderOnWhatsApp,
  }
}