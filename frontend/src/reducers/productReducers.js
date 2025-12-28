import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    error: null,
    page: 1,
    pageSize: 12,
    totalPages: 1,
    count: 0,
  },
  reducers: {
    productListRequest(state) {
      state.loading = true;
    },
    productListSuccess(state, action) {
      state.loading = false;
      const payload = action.payload;
      const data = payload.data;

      if (Array.isArray(data)) {
        // fallback if API returns plain list
        state.items = data;
        state.count = data.length;
        state.totalPages = 1;
        state.page = payload.page || 1;
        state.pageSize = payload.pageSize || state.pageSize;
      } else {
        state.items = data.results || data;
        state.count = data.count || state.count;
        state.page = payload.page || state.page;
        state.pageSize = payload.pageSize || state.pageSize;
        state.totalPages = state.pageSize ? Math.ceil(state.count / state.pageSize) : 1;
      }
    },
    productListFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  productListRequest,
  productListSuccess,
  productListFail,
} = productSlice.actions;

export default productSlice.reducer;
