export const useOrder = () => {
  const sendToWhatsApp = (productName: string) => {
    const myNumber = "233270751657"; 
    const message = `Hello RunGoRun! 🔥 I want to order the ${productName}. Please send me delivery details.`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${myNumber}?text=${encoded}`, '_blank');
  }

  return { sendToWhatsApp }
}