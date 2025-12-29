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
      <h2 className="mb-4 fw-bold">Shopping Cart</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {cartItems.length === 0 ? (
        <Alert variant="info">
          Your cart is empty. <Link to="/">Go Back</Link>
        </Alert>
      ) : (
        <Row>
          <Col md={8}>
            <ListGroup variant="flush" className="cart-list shadow-sm">
              {cartItems.map((item) => (
                <ListGroup.Item key={item.id} className="p-4">
                  <Row className="align-items-center">
                    <Col md={2}>
                      <Image
                        src={getImageUrl(item.product?.image_url)}
                        alt={item.product?.name}
                        fluid
                        rounded
                        className="cart-img"
                      />
                    </Col>
                    <Col md={4}>
                      <Link to={`/product/${item.product?.id}`} className="text-decoration-none text-dark">
                        <span className="fw-semibold fs-5">{item.product?.name}</span>
                      </Link>
                    </Col>
                    <Col md={2} className="text-muted">
                      ₹{item.product?.price}
                    </Col>
                    <Col md={3}>
                      <QuantitySelector
                        value={item.quantity}
                        max={item.product?.stock || 99}
                        onChange={(val) => dispatch(updateCartItem(item.id, val))}
                        onRemove={() => removeFromCartHandler(item.id)}
                        disabled={loading}
                      />
                    </Col>
                    <Col md={2}>
                      {/* Optional Remove Button */}
                      <Button variant="light" onClick={() => removeFromCartHandler(item.id)}>
                        <i className="fas fa-trash"></i> Remove
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>

          <Col md={4}>
            <Card className="shadow-premium border-0">
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h4 className="fw-bold">Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)}) items</h4>
                  <h3 className="fw-bold text-primary">₹{totalPrice.toFixed(2)}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="w-100 btn-primary rounded-pill py-2"
                    disabled={cartItems.length === 0}
                    onClick={orderHandler}
                  >
                    Proceed to Checkout
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default CartScreen;
