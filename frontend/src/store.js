import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./reducers/authReducers";
import productReducer from "./reducers/productReducers";
import cartReducer from "./reducers/cartReducers";
import orderReducer from "./reducers/orderReducers";

// Load user info from storage if available
const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialState = {
  auth: { userInfo: userInfoFromStorage },
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    orders: orderReducer,
  },
  preloadedState: initialState,
});

export default store;
