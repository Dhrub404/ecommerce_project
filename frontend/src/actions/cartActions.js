import api from "../api/axios";
import {
  cartRequest,
  cartSuccess,
  cartFail,
} from "../reducers/cartReducers";

export const fetchCart = () => async (dispatch) => {
  try {
    dispatch(cartRequest());
    // If not authenticated, avoid calling protected endpoint and treat as empty cart
    const token = localStorage.getItem("accessToken");
    if (!token) {
      dispatch(cartSuccess({ items: [] }));
      return;
    }

    const { data } = await api.get("cart/");
    dispatch(cartSuccess(data));
  } catch (error) {
    // If unauthorized, treat as empty cart rather than an error
    if (error.response && error.response.status === 401) {
      dispatch(cartSuccess({ items: [] }));
    } else {
      dispatch(cartFail(error.response?.data?.detail || error.message));
    }
  }
};

export const addToCart = (productId, quantity = 1) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      // Not logged in — redirect to login page to add to cart
      window.location.href = "/login";
      return;
    }

    await api.post("cart/add/", {
      product_id: productId,
      quantity,
    });
    dispatch(fetchCart());
  } catch (error) {
    if (error.response && error.response.status === 401) {
      window.location.href = "/login";
      return;
    }
    dispatch(cartFail(error.response?.data?.detail || error.message));
  }
};

export const updateCartItem = (itemId, quantity) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    await api.post("cart/update/", {
      item_id: itemId,
      quantity,
    });
    dispatch(fetchCart());
  } catch (error) {
    if (error.response && error.response.status === 401) {
      window.location.href = "/login";
      return;
    }
    dispatch(cartFail(error.response?.data?.detail || error.message));
  }
};

export const removeFromCart = (itemId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    await api.post("cart/remove/", {
      item_id: itemId
    });
    dispatch(fetchCart());
  } catch (error) {
    dispatch(cartFail(error.response?.data?.detail || error.message));
  }
};
