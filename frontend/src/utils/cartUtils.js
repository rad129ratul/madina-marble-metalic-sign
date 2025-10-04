export const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };
  
  export const updateCart = (state) => {
    const itemsPrice = state.cartItems.reduce(
      (acc, item) => acc + (item.price * 100 * item.qty) / 100,
      0
    );
    state.itemsPrice = addDecimals(itemsPrice);

    state.shippingPrice = addDecimals(0);
    state.taxPrice = addDecimals(0);

    const totalPrice = itemsPrice;
    state.totalPrice = addDecimals(totalPrice);
    localStorage.setItem('cart', JSON.stringify(state));
  
    return state;
  };
  