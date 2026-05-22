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
    const text = `${appConfig.brand.whatsappMessage}

Brand: ${appConfig.brand.name}
Item: ${productName}
Price: GHS ${price}
Quantity: ${quantity}
Size: ${size}`

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  return {
    orderOnWhatsApp,
  }
}