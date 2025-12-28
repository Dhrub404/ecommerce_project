import api from "../api/axios";
import {
  productListRequest,
  productListSuccess,
  productListFail,
} from "../reducers/productReducers";

export const listProducts = (page = 1, pageSize = 9) => async (dispatch) => {
  try {
    dispatch(productListRequest());
    const { data } = await api.get(`products/?page=${page}&page_size=${pageSize}`);
    dispatch(productListSuccess({ data, page, pageSize }));
  } catch (error) {
    dispatch(productListFail(error.message));
  }
};
