import api from "../api/axios";
import {
  orderRequest,
  orderSuccess,
  orderListSuccess,
  orderFail,
} from "../reducers/orderReducers";
import { fetchCart } from "./cartActions";

// PLACE ORDER
export const placeOrder = () => async (dispatch) => {
  try {
    dispatch(orderRequest());

    await api.post("orders/create/");

    dispatch(orderSuccess()); // 🔥 success flag only
    dispatch(fetchCart());    // 🔥 auto refresh cart
  } catch (error) {
    dispatch(orderFail(error.response?.data?.detail || error.message));
  }
};

// FETCH ORDERS
export const fetchOrders = () => async (dispatch) => {
  try {
    dispatch(orderRequest());

    const { data } = await api.get("orders/");
    dispatch(orderListSuccess(data));
  } catch (error) {
    dispatch(orderFail(error.response?.data?.detail || error.message));
  }
};
