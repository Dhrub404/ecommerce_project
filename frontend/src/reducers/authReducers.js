import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userInfo: null,
    loading: false,
    error: null,
  },
  reducers: {
    loginRequest(state) {
      state.loading = true;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.userInfo = action.payload;
    },
    loginFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.userInfo = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userInfo");
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFail,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
