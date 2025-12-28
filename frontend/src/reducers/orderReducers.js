import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
    success: false, // ONLY for placeOrder
  },
  reducers: {
    orderRequest(state) {
      state.loading = true;
      state.error = null;
    },

    // 🔥 USED AFTER PLACE ORDER
    orderSuccess(state) {
      state.loading = false;
      state.success = true;
    },

    // 🔥 USED FOR FETCH ORDERS LIST
    orderListSuccess(state, action) {
      state.loading = false;
      state.orders = action.payload;
    },

    orderFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // OPTIONAL BUT PROFESSIONAL
    resetOrderSuccess(state) {
      state.success = false;
    },
  },
});

export const {
  orderRequest,
  orderSuccess,
  orderListSuccess,
  orderFail,
  resetOrderSuccess,
} = orderSlice.actions;

export default orderSlice.reducer;
