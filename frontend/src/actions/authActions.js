import api from "../api/axios";
import {
  loginRequest,
  loginSuccess,
  loginFail,
} from "../reducers/authReducers";

export const login = (username, password) => async (dispatch) => {
  try {
    dispatch(loginRequest());

    const { data } = await api.post("auth/login/", {
      username,
      password,
    });

    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("userInfo", JSON.stringify(data));
    dispatch(loginSuccess(data));
  } catch (error) {
    dispatch(loginFail(error.message));
  }
};

export const register = (username, email, password, name) => async (dispatch) => {
  try {
    dispatch(loginRequest()); // Re-using loginRequest to set loading=true

    const { data } = await api.post("auth/register/", {
      username,
      email,
      password,
      first_name: name
    });

    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("userInfo", JSON.stringify(data));
    dispatch(loginSuccess(data));
  } catch (error) {
    dispatch(loginFail(error.response?.data?.detail || error.message));
  }
};
