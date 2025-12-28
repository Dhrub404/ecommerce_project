import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../actions/cartActions";
import { placeOrder } from "../actions/orderActions";
import './CartScreen.css';

function CartScreen() {
  const dispatch = useDispatch();

  const { items, loading, error } = useSelector((state) => state.cart);
  const { success } = useSelector((state) => state.orders);
  const { userInfo } = useSelector((state) => state.auth);

  // Only fetch cart for authenticated users
  useEffect(() => {
    if (userInfo) dispatch(fetchCart());
  }, [dispatch, userInfo]);

  // 🔥 THIS FIXES AUTO REFRESH AFTER ORDER
  useEffect(() => {
    if (success && userInfo) {
      dispatch(fetchCart());
    }
  }, [dispatch, success, userInfo]);

  const orderHandler = () => {
    dispatch(placeOrder());
  };

  if (!userInfo) {
    return (
      <div className="container">
        <h2>Your Cart</h2>
        <p>Please <Link to="/login">login</Link> to view your cart.</p>
      </div>
    );
  }

  if (loading) return <p>Loading cart...</p>;

  // Calculate subtotal
  const cartItems = items || [];
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.quantity * (item.product?.price || 0),
    0
  );

  const BACKEND_URL = 'http://127.0.0.1:8000';

  const getImageUrl = (path) => {
    if (!path) return '/placeholder.svg';
    if (path.startsWith('http')) return path;
    return `${BACKEND_URL}${path}`;
  };

  return (
    <div className="container">
      <h2>Your Cart</h2>

      {error && (
        <p style={{ color: 'red' }}>{error}</p>
      )}

      {cartItems.length === 0 && <p>Cart is empty</p>}

      {cartItems.map((item) => (
        <div key={item.id} className="cart-item">
          <div className="cart-thumb">
            <img
              src={getImageUrl(item.product?.image_url)}
              alt={item.product?.name || 'Product unavailable'}
            />
          </div>
          <div className="cart-details">
            <p className="cart-name">
              {item.product ? item.product.name : <span style={{ color: 'red' }}>Product Unavailable</span>}
            </p>
            <p>Qty: {item.quantity}</p>
            <p>₹{item.product?.price || '---'}</p>
          </div>
        </div>
      ))}

      {cartItems.length > 0 && (
        <div className="cart-summary">
          <h3>Total: ₹{totalPrice.toFixed(2)}</h3>
          <button className="btn btn-primary" onClick={orderHandler}>
            Place Order
          </button>
        </div>
      )}
    </div>
  );
}

export default CartScreen;
