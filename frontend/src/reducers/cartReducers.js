import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    cartRequest(state) {
      state.loading = true;
    },
      cartSuccess(state, action) {
      state.loading = false;
      // Accept either { items: [...] } or an array payload (backends differ)
      state.items = action.payload && action.payload.items ? action.payload.items : (Array.isArray(action.payload) ? action.payload : (action.payload || []));
    },
    cartFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { cartRequest, cartSuccess, cartFail } =
  cartSlice.actions;

export default cartSlice.reducer;
