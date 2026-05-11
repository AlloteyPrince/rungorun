export const useWhatsApp = () => {
  const orderOnWhatsApp = (productName, price) => {
    const phone = "233XXXXXXXXX"; // Your actual number
    const text = `Hello Prince! 🔥 I want to order the *${productName}* (${price}).`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  }
  return { orderOnWhatsApp }
}