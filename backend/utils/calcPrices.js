function addDecimals(num) {
    return (Math.round(num * 100) / 100).toFixed(2);
  }
  
export function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + (item.price * 100 * item.qty) / 100,
    0
  );

  const totalPrice = itemsPrice;

  return {
    itemsPrice: addDecimals(itemsPrice),
    shippingPrice: addDecimals(0),
    taxPrice: addDecimals(0),
    totalPrice: addDecimals(totalPrice),
  };
}
  