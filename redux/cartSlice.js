    const { createSlice } = require("@reduxjs/toolkit");

    const cartSlice = createSlice({
      name: 'cart',
      initialState: {
        products: [],
        others: [],
        items:[],
        total: 0,
        totalQty:0,

      },
      reducers: {
        addToCart(state, action) {
          const existingItem = state.products.some(item => item.itemID === action.payload.product.itemID);
          if (!existingItem) {
            state.products.push(action.payload.product)
          }
        },

        getTotal(state, action) {
          const { itemID, deliveryType, service } = action.payload;
          const { others, products, items } = state;
          const qty = others.find((o) => o.itemID === itemID)?.qty || 0;
          const productIndex = products.findIndex((p) => p.itemID == itemID);
          if (productIndex !== -1 && qty > 0) {
            const price = products[productIndex].pricing.find(
              (i) => i.deliveryType == deliveryType && i.service == service
            )?.price;
            if (price > 0) {
              const itemIndex = items.findIndex((i) => i.itemID == itemID);
              if (itemIndex !== -1) {
                items[itemIndex] = { ...items[itemIndex], price, qty, deliveryType, service };
              } else if (qty > 0) {
                items.push({ itemID, price, qty, deliveryType, service });
              }
            }
          } else if (productIndex == -1 && items.some((i) => i.itemID == itemID)) {
            items.splice(items.findIndex((i) => i.itemID == itemID), 1);
          }
          state.total = items.reduce((acc, item) => acc + parseFloat(item.price * item.qty), 0).toFixed(2);
          state.totalQty = items.reduce((acc, item) => acc + item.qty, 0);
        },
        removeItem(state, action) {
          const itemID = action.payload.itemID;
          const index = state.products.findIndex((p) => p.itemID === itemID);
          if (index !== -1) {
            state.products.splice(index, 1);
            state.items.splice(index, 1);
            state.others.splice(index, 1);
          }
        },

        updateOthers(state, action) {
          const { itemID, qty, selectedButton, deliveryPrice } = action.payload.others;
          const existingItemIndex = state.others.findIndex((i) => i.itemID === itemID);
          if (existingItemIndex !== -1) {
            state.others[existingItemIndex] = { ...state.others[existingItemIndex], qty, selectedButton, deliveryPrice };
          } else {
            state.others.push(action.payload.others);
          }
        },
      }
    });

    export const { addToCart, removeItem, updateOthers,getTotal } = cartSlice.actions;

    export default cartSlice.reducer;
