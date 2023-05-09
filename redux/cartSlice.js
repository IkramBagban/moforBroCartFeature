import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const {
        id,
        name,
        quantity,
        category,
        service,
        delivery,
        cartItem,
        deliveryType,
      } = action.payload;
      state.products.push({
        id,
        name,
        quantity,
        category,
        service,
        delivery,
        cartItem,
        deliveryType,
      });
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      state.products = state.products.filter((item) => item.id !== id);
    },

    updateCartItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.products.find((item) => item.id === id);
      if (existingItem) existingItem.quantity = quantity;
    },

    updateItemServiceType: (state, action) => {
      const { id, serviceType, servicePrice } = action.payload;
      const item = state.products.find((item) => item.id === id);
      if (item) 
        item.service = {type: serviceType, price: servicePrice};
      },

    updateItemDelivery: (state, action) => {
      const { id, delivery } = action.payload;
      const item = state.products.find((item) => item.id === id);
      if (item) {
        item.delivery = {
          type: delivery,
        };
      }
    },
    updateDeliveryType(state, action) {
      const { servicePrice, deliveryType } = action.payload;
      state.products.map((product) => {
        product.deliveryType = deliveryType;
        product.service.price = servicePrice;
      });
    },
  },
});

export default cartSlice.reducer;
export const {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  updateItemServiceType,
  updateItemDelivery,
  updateDeliveryType,
} = cartSlice.actions;

// export memoized selector Fns

export const selectCart = (state) => state.cart;

// export const selectCart = createSelector(
//   (state) => state.cart,
//   (cartState) => cartState
// );

export const selectAllCartItems = createSelector(
  selectCart,
  (cartState) => cartState.products
);

export const selectCartItemById = createSelector(
  // [(state) => state.cart, (state, itemId) => itemId],
  [selectCart, (state, itemId) => itemId],
  (cartState, itemId) => {
    // if (!Boolean(cartItems.length)) return undefined;
    const item = cartState.products.find((item) => item.id === itemId);
    // console.log('item: ', item);
    return item;
  }
);

export const selectCartTotalPrice = createSelector(selectCart, (cartState) => {
  if (!Boolean(cartState.products.length)) return 0;
  const price = cartState.products.reduce((totalPrice, cartItem) => {
    return totalPrice + cartItem.quantity * cartItem.service.price;
  }, 0);

  return parseFloat(price.toFixed(2));
});

export const selectCartTotalQuantity = createSelector(
  selectCart,
  (cartState) => {
    if (!Boolean(cartState.products.length)) return 0;
    return cartState.products.reduce((totalQty, cartItem) => {
      return totalQty + cartItem.quantity;
    }, 0);
  }
);

export const selectItemTotalPrice = createSelector(
  [
    selectCart,
    (state, itemId) =>
      state.cart.products.find((cartItem) => cartItem.id === itemId),
  ],

  (cartState, item) => {
    // console.log('total price: ', item);
    if (!item) return 0;
    const price = item.quantity * item.service.price;
    return Number(price.toFixed(2));
  }
);
