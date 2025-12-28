import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../actions/orderActions";
import './OrderScreen.css';

function OrderScreen() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="container">
      <h2>My Orders</h2>

      {orders.length === 0 && <p>No orders yet</p>}

      {orders.map((order) => (
        <div key={order.id} className="card">
          <p>Order ID: {order.id}</p>
          <p>Total: ₹{order.total_price}</p>
        </div>
      ))}
    </div>
  );
}

export default OrderScreen;
