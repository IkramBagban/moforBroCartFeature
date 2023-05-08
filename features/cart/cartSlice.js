import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

// const cartAdapter = createEntityAdapter();
// const initialState = cartAdapter.getInitialState();

const initialState = {
  products: [
    // {
    //   itemID: 1,
    //   id: '',
    //   name: '',
    //   category: '',
    //   service: {
    //     type: '',
    //     price: 0,
    //   },
    //   delivery: {
    //     type: '',
    //     price: 0,
    //   },
    //   quantity: 0,
    // },
  ],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, name, quantity, category, service, delivery } =
        action.payload;

      console.log(`Adding item with id ${id} to cart`);

      // const existingItem = state.products.find((item) => item.id === id);
      // if (existingItem) {
      //   existingItem.quantity += 1;
      // } else {
      state.products.push({
        id,
        name,
        quantity,
        category,
        service,
        delivery,
      });
      // }
      console.log(`Successfully added item with id ${id} to cart`);
    },

    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state = state.products.filter((item) => item.id !== itemId);
    },

    updateCartItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      console.log('updates: ', { id, quantity });
      const existingItem = state.products.find((item) => item.id === id);
      if (existingItem) {
        existingItem.quantity = quantity;
      }
    },

    clearCart: (state) => {
      return [];
    },

    updateItemServiceType: (state, action) => {
      const { itemId, serviceType, servicePrice } = action.payload;
      const item = state.products.find((item) => item.id === itemId);
      console.log(item);
      if (item) {
        item.service = {
          type: serviceType,
          price: servicePrice,
        };
      }
    },

    updateItemDeliveryType: (state, action) => {
      const { itemId, deliveryType, deliveryPrice } = action.payload;
      const item = state.products.find((item) => item.id === itemId);
      if (item) {
        item.delivery = {
          type: deliveryType,
          price: deliveryPrice,
        };
      }
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
  updateItemDeliveryType,
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
    console.log('item: ', item);
    return item;
  }
);

export const selectCartTotalPrice = createSelector(selectCart, (cartState) => {
  if (!Boolean(cartState.products.length)) return 0;
  cartState.products.reduce((totalPrice, cartItem) => {
    return (
      totalPrice +
      cartItem.quantity * cartItem.service.price * cartItem.delivery.price
    );
  }, 0);
});

export const selectCartTotalQuantity = createSelector(
  selectCart,
  (cartState) => {
    if (!Boolean(cartState.products.length)) return 0;
    cartState.products.reduce((totalQty, cartItem) => {
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
    console.log('total price: ', item);
    if (!item) return 0;
    return item.quantity * item.service.price * item.delivery.price;
  }
);
