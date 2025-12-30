import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Image, ListGroup, Card, Button, Form, Alert, Spinner, Badge } from "react-bootstrap";
import { addToCart } from "../actions/cartActions";
import api from "../api/axios";
import './ProductDetailScreen.css'; // Assuming CSS file still exists and is good

function ProductDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // -- Global State --
  const { userInfo } = useSelector((state) => state.auth);
  // We only need to check cart to see if we should show "Update" text, purely cosmetic/UX
  const { items: cartItems } = useSelector((state) => state.cart);
  const cartItem = cartItems.find(item => item.product.id === Number(id));

  // -- Local State --
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // STRICT QUANTITY STATE: Always a number, default 1
  const [qty, setQty] = useState(1);

  // -- Review State --
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewError, setReviewError] = useState(null);

  // -- Fetch Data --
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`products/${id}/`);
        setProduct(data);
        // Optional: If item is in cart, sync start qty? 
        // Let's decide: User often expects to see "Add to Cart" (1) or "Your Cart: (5)".
        // To keep logic SIMPLE and ROBUST: We will default to 1. 
        // If user wants to add MORE, they add more. 
        // If they want to update, they can go to cart.
        // However, user "Cartify" style usually implies syncing.
        // Let's safe-sync:
        if (cartItem) {
          setQty(cartItem.quantity);
        } else {
          setQty(1);
        }
      } catch (err) {
        setError(err.response?.data?.detail || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, cartItem]);

  // -- Handlers --

  // PURE MATH INCREMENT
  const incrementQty = () => {
    if (product && qty < product.stock) {
      setQty(prev => prev + 1);
    }
  };

  // PURE MATH DECREMENT
  const decrementQty = () => {
    if (qty > 1) {
      setQty(prev => prev - 1);
    }
  };

  const addToCartHandler = () => {
    // Force Number() just to be absolutely paranoid
    dispatch(addToCart(id, Number(qty)));
    navigate('/cart');
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/products/${id}/reviews/`, { rating, comment });
      alert("Review Submitted!");
      setRating(0);
      setComment("");
      const { data } = await api.get(`products/${id}/`);
      setProduct(data);
    } catch (err) {
      setReviewError(err.response?.data?.detail || err.message);
    }
  };

  if (loading) return (
    <Container className="py-5 text-center">
      <Spinner animation="border" />
    </Container>
  );

  if (error) return (
    <Container className="py-5">
      <Alert variant="danger">{error}</Alert>
    </Container>
  );

  if (!product) return (
    <Container className="py-5">
      <Alert variant="warning">Product not found.</Alert>
    </Container>
  );

  const isOutOfStock = product.stock === 0;
  const imageUrl = product.image_url || (product.image ? `http://127.0.0.1:8000${product.image}` : '/placeholder.svg');

  return (
    <Container className="py-5-custom product-detail-container">
      <Link className="btn btn-outline-secondary mb-4" to="/">
        &larr; Back to Results
      </Link>

      <Row>
        {/* IMAGE COLUMN */}
        <Col md={5} className="mb-4">
          <div className="product-image-container shadow-premium">
            <Image
              src={imageUrl}
              alt={product.name}
              className="img-fluid rounded"
              onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.svg'; }}
            />
          </div>
        </Col>

        {/* DETAILS COLUMN */}
        <Col md={4} className="mb-4">
          <ListGroup variant="flush">
            <ListGroup.Item className="border-0">
              <h2 className="fw-bold display-6">{product.name}</h2>
            </ListGroup.Item>
            <ListGroup.Item className="border-0">
              <div className="d-flex align-items-center mb-2">
                <div className="rating-stars me-2 text-warning">
                  {"★".repeat(Math.round(product.rating || 0))}
                  {"☆".repeat(5 - Math.round(product.rating || 0))}
                </div>
                <span className="text-muted small">({product.numReviews} reviews)</span>
              </div>
            </ListGroup.Item>
            <ListGroup.Item className="border-0">
              <h3 className="fw-bold product-price-detail text-primary">₹{product.price}</h3>
            </ListGroup.Item>
            <ListGroup.Item className="border-0">
              <p className="product-desc lead fs-6">{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>

        {/* BUY BOX COLUMN */}
        <Col md={3}>
          <Card className="shadow-premium border-0">
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col><strong>₹{product.price}</strong></Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    {isOutOfStock ?
                      <Badge bg="danger">Out of Stock</Badge> :
                      <Badge bg="success">In Stock</Badge>
                    }
                  </Col>
                </Row>
              </ListGroup.Item>

              {/* INLINE QUANTITY CONTROLS - NO EXTERNAL COMPONENT */}
              {!isOutOfStock && (
                <ListGroup.Item>
                  <Row className="align-items-center">
                    <Col>Qty</Col>
                    <Col>
                      <div className="d-flex align-items-center justify-content-between border rounded-pill px-2 py-1 bg-light">
                        <Button
                          variant="link"
                          size="sm"
                          className="text-decoration-none text-dark fw-bold"
                          onClick={decrementQty}
                          disabled={qty <= 1}
                        >
                          -
                        </Button>
                        <span className="fw-bold mx-2">{qty}</span>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-decoration-none text-dark fw-bold"
                          onClick={incrementQty}
                          disabled={qty >= product.stock}
                        >
                          +
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Button
                  onClick={addToCartHandler}
                  className="w-100 btn-primary rounded-pill py-2"
                  type="button"
                  disabled={isOutOfStock}
                >
                  {isOutOfStock ? 'Out of Stock' : (cartItem ? 'Update Cart' : 'Add to Cart')}
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>

      {/* REVIEWS */}
      <Row className="mt-5">
        <Col md={8}>
          <h3 className="mb-4 fw-bold">Customer Reviews</h3>
          {product.reviews.length === 0 && <Alert variant="info">No reviews yet.</Alert>}

          <div className="mb-4">
            {product.reviews.map((review) => (
              <Card key={review.id} className="mb-3 border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <strong>{review.name}</strong>
                    <div className="text-warning">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>
                  </div>
                  <p className="text-muted small">{review.createdAt?.substring(0, 10)}</p>
                  <Card.Text>{review.comment}</Card.Text>
                </Card.Body>
              </Card>
            ))}
          </div>

          <Card className="shadow-sm border-0">
            <Card.Body>
              <h4>Write a Review</h4>
              {userInfo ? (
                <Form onSubmit={submitReviewHandler}>
                  {reviewError && <Alert variant="danger">{reviewError}</Alert>}
                  <Form.Group className="mb-3" controlId="rating">
                    <Form.Label>Rating</Form.Label>
                    <Form.Select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                      <option value="">Select...</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="comment">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </Form.Group>
                  <Button type="submit" variant="primary">Submit</Button>
                </Form>
              ) : (
                <Alert variant="warning">Please <Link to="/login">login</Link> to write a review</Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ProductDetailScreen;
