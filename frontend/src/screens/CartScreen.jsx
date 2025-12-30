import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, ListGroup, Image, Form, Button, Card, Container, Alert } from "react-bootstrap";
import { fetchCart, addToCart, removeFromCart, updateCartItem } from "../actions/cartActions";
import QuantitySelector from "../components/QuantitySelector";
import { placeOrder } from "../actions/orderActions";
import './CartScreen.css';

function CartScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, loading, error } = useSelector((state) => state.cart);
  const { success } = useSelector((state) => state.orders);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchCart());
    } else {
      navigate('/login');
    }
  }, [dispatch, userInfo, navigate]);

  useEffect(() => {
    if (success && userInfo) {
      dispatch(fetchCart());
    }
  }, [dispatch, success, userInfo]);

  const orderHandler = () => {
    navigate('/shipping');
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  if (loading) return <p>Loading cart...</p>;

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
    <Container className="py-5-custom cart-container">
      <h2 className="mb-4 fw-bold cart-header-title">Shopping Cart</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {cartItems.length === 0 ? (
        <div className="empty-cart-container">
          <div className="empty-cart-icon-wrapper">
            <i className="fas fa-shopping-cart empty-cart-icon"></i>
          </div>
          <h2 className="empty-cart-title">Your Cart is Empty</h2>
          <p className="empty-cart-subtitle">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="btn btn-primary btn-lg rounded-pill px-5 shadow-lg">
            Start Shopping
          </Link>
        </div>
      ) : (
        <Row>
          <Col md={8}>
            {cartItems.map((item) => (
              <Card key={item.id} className="mb-3 border-0 shadow-sm cart-item-card">
                <Card.Body className="p-3">
                  <Row className="align-items-center">
                    <Col xs={3} sm={2} className="d-flex justify-content-center">
                      <div className="cart-item-image-container p-2 rounded bg-light">
                        <Image
                          src={getImageUrl(item.product?.image_url)}
                          alt={item.product?.name}
                          fluid
                          className="cart-img"
                        />
                      </div>
                    </Col>

                    <Col xs={9} sm={10}>
                      <Row className="align-items-center h-100">
                        <Col md={5} className="mb-2 mb-md-0">
                          <Link to={`/product/${item.product?.id}`} className="text-decoration-none text-dark">
                            <h5 className="fw-bold mb-1">{item.product?.name}</h5>
                          </Link>
                          <small className="text-muted">Price: ₹{item.product?.price}</small>
                        </Col>

                        <Col md={3} className="text-end text-md-center mb-2 mb-md-0">
                          <h4 className="fw-bold cart-item-price mb-0">₹{item.product?.price}</h4>
                        </Col>

                        <Col md={4} className="d-flex flex-column align-items-end align-items-md-center">
                          <QuantitySelector
                            value={item.quantity}
                            max={item.product?.stock || 99}
                            onChange={(val) => dispatch(updateCartItem(item.id, val))}
                            onRemove={() => removeFromCartHandler(item.id)}
                            disabled={loading}
                          />
                          <div
                            className="mt-2 text-danger small fw-bold cursor-pointer cart-remove-text"
                            onClick={() => removeFromCartHandler(item.id)}
                            role="button"
                          >
                            Remove
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </Col>

          <Col md={4}>
            <Card className="border-0 shadow-sm order-summary-card">
              <Card.Body className="p-4">
                <h4 className="fw-bold mb-4">Order Summary</h4>

                <div className="d-flex justify-content-between mb-3 summary-row">
                  <span className="text-muted">Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                  <span className="fw-bold">₹{totalPrice.toFixed(2)}</span>
                </div>

                <div className="d-flex justify-content-between mb-3 summary-row">
                  <span className="text-success">Discount</span>
                  <span className="text-success fw-bold">-₹0.00</span>
                </div>

                <hr className="my-3" />

                <div className="d-flex justify-content-between mb-4 summary-row">
                  <span className="fw-bold fs-5">Total</span>
                  <span className="fw-bold fs-5">₹{totalPrice.toFixed(2)}</span>
                </div>

                <Button
                  type="button"
                  className="w-100 checkout-btn rounded py-2 fw-bold"
                  disabled={cartItems.length === 0}
                  onClick={orderHandler}
                >
                  Proceed to Checkout
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default CartScreen;
