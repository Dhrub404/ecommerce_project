import api from "../api/axios";
import {
  orderRequest,
  orderSuccess,
  orderListSuccess,
  orderFail,
} from "../reducers/orderReducers";
import { fetchCart } from "./cartActions";

// PLACE ORDER
export const placeOrder = (addressData) => async (dispatch) => {
  try {
    dispatch(orderRequest());

    const { data } = await api.post("orders/add/", {
      address: addressData.address,
      city: addressData.city,
      postal_code: addressData.postal_code,
      country: addressData.country
    });

    dispatch(orderSuccess()); // 🔥 success flag only
    dispatch(fetchCart());    // 🔥 auto refresh cart
    return data;
  } catch (error) {
    dispatch(orderFail(error.response?.data?.detail || error.message));
  }
};

// FETCH ORDERS
// UPDATE ORDER STATUS
export const updateOrderStatus = (id, status) => async (dispatch) => {
  try {
    await api.patch(`orders/${id}/`, { status });
    dispatch(fetchOrders()); // Refresh list
  } catch (error) {
    console.error("Update failed", error);
    // Optionally dispatch fail
  }
};

export const fetchOrders = () => async (dispatch) => {
  try {
    dispatch(orderRequest());

    const { data } = await api.get("orders/myorders/");
    dispatch(orderListSuccess(data));
  } catch (error) {
    dispatch(orderFail(error.response?.data?.detail || error.message));
  }
};
