const { configureStore } = require("@reduxjs/toolkit");
import cartReducer from './cartSlice';


export const store = configureStore({
    reducer:{
        cart:cartReducer,
      
    }
})