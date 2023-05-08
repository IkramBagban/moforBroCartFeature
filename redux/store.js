const { configureStore, getDefaultMiddleware } = require('@reduxjs/toolkit');
import { apiSlice } from '../features/api/apiSlice';
import cartReducer from '../features/cart/cartSlice';
// import cartReducer from './cartSlice';
import logger from 'redux-logger';

export const store = configureStore({
  reducer: {
    // cart: cartReducer,
    cart: cartReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger, apiSlice.middleware),
});
