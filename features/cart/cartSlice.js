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
      const id = action.payload;
      console.log(`removing item ${id} from store`);
      state.products = state.products.filter((item) => item.id !== id);
      console.log(`successfully removed ${id} from store`);
    },

    updateCartItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      // console.log('updates: ', { id, quantity });
      console.log(`updating item ${id} to quantity ${quantity}`);
      const existingItem = state.products.find((item) => item.id === id);
      if (existingItem) {
        existingItem.quantity = quantity;
        console.log(`Successfully updated item ${id}`);
      }
      console.log(`Item ${id} not found`);
    },

    clearCart: (state) => {
      console.log('Clearing out cart');
      return [];
    },

    updateItemServiceType: (state, action) => {
      const { id, serviceType, servicePrice } = action.payload;
      console.log(`Updating item ${id} service`);
      const item = state.products.find((item) => item.id === id);
      console.log(item);
      if (item) {
        item.service = {
          type: serviceType,
          price: servicePrice,
        };
        console.log(
          `Successfully updated Item service ${item.id} to ${item.service.type}`
        );
      }
      console.log(`item ${id} not found`);
    },

    updateItemDeliveryType: (state, action) => {
      const { id, deliveryType, deliveryPrice } = action.payload;
      console.log(`Updating item ${id} delivery`);
      const item = state.products.find((item) => item.id === id);
      if (item) {
        item.delivery = {
          type: deliveryType,
          price: deliveryPrice,
        };
        console.log(
          `Successfully updated item ${item.id} delivery to ${item.delivery.type}`
        );
      }
      console.log(`Item ${id} not found`);
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
    // console.log('item: ', item);
    return item;
  }
);

export const selectCartTotalPrice = createSelector(selectCart, (cartState) => {
  if (!Boolean(cartState.products.length)) return 0;
  return cartState.products.reduce((totalPrice, cartItem) => {
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
    const price = cartState.products.reduce((totalQty, cartItem) => {
      return totalQty + cartItem.quantity;
    }, 0);

    return parseFloat(price.toFixed(2));
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
    const price = item.quantity * item.service.price * item.delivery.price;
    return parseFloat(price.toFixed(2));
  }
);
