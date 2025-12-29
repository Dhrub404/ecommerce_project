import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Image, ListGroup, Card, Button, Form, Alert, Spinner, Badge } from "react-bootstrap";
import { addToCart, removeFromCart, updateCartItem } from "../actions/cartActions";
import api from "../api/axios";
import QuantitySelector from "../components/QuantitySelector";
import './ProductDetailScreen.css';

function ProductDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1); // Default to 1 so "Add to Cart" works immediately on load

  // Review State
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewError, setReviewError] = useState(null);

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`products/${id}/`);
      setProduct(data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const [inCart, setInCart] = useState(false);
  const { items: cartItems } = useSelector((state) => state.cart);

  useEffect(() => {
    if (cartItems && product) {
      const item = cartItems.find(x => x.product.id === product.id);
      setInCart(!!item);
      if (item) setQty(item.quantity);
    }
  }, [cartItems, product]);

  const addToCartHandler = () => {
    const finalQty = Number(qty) > 0 ? Number(qty) : 1;
    dispatch(addToCart(id, finalQty));
    navigate('/cart');
  };

  const removeFromCartHandler = () => {
    if (cartItems && product) {
      const item = cartItems.find(x => x.product.id === product.id);
      if (item) {
        dispatch(removeFromCart(item.id));
        setInCart(false);
        setQty(0);
      }
    }
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/products/${id}/reviews/`, { rating, comment });
      alert("Review Submitted!");
      setRating(0);
      setComment("");
      fetchProduct(); // Refresh to show new review
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

  const imageUrl = product.image_url || (product.image ? `http://127.0.0.1:8000${product.image}` : null);

  return (
    <Container className="py-5-custom product-detail-container">
      <Link className="btn btn-outline-secondary mb-4" to="/">
        &larr; Back to Results
      </Link>

      <Row>
        {/* 1. Image Column */}
        <Col md={5} className="mb-4">
          <div className="product-image-container shadow-premium">
            <Image
              src={imageUrl || '/placeholder.svg'}
              alt={product.name}
              className="img-fluid"
              onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.svg'; }}
            />
          </div>
        </Col>

        {/* 2. Info Column */}
        <Col md={4} className="mb-4">
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2 className="fw-bold">{product.name}</h2>
            </ListGroup.Item>
            <ListGroup.Item>
              <div className="d-flex align-items-center">
                <div className="rating-stars me-2">
                  {"★".repeat(Math.round(product.rating || 0))}
                  {"☆".repeat(5 - Math.round(product.rating || 0))}
                </div>
                <span className="text-muted small">({product.numReviews} ratings)</span>
              </div>
            </ListGroup.Item>
            <ListGroup.Item>
              <h3 className="fw-bold product-price-detail">₹{product.price}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <p className="product-desc">{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>

        {/* 3. Buy Box Column */}
        <Col md={3}>
          <Card className="shadow-premium">
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
                    {product.stock > 0 ? (
                      <Badge bg="success">In Stock</Badge>
                    ) : (
                      <Badge bg="danger">Out of Stock</Badge>
                    )}
                  </Col>
                </Row>
              </ListGroup.Item>

              {product.stock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Qty</Col>
                    <Col>
                      <QuantitySelector
                        value={Number(qty)}
                        max={product.stock}
                        onChange={(val) => {
                          setQty(val);
                          if (inCart && val > 0) {
                            dispatch(addToCart(id, Number(val)));
                          }
                        }}
                        onRemove={removeFromCartHandler}
                      />
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                {inCart && qty > 0 ? (
                  <Button
                    className="w-100 btn-block btn-success rounded-pill"
                    type="button"
                    onClick={() => navigate('/cart')}
                  >
                    Go to Cart
                  </Button>
                ) : (
                  <Button
                    onClick={addToCartHandler}
                    className="w-100 btn-primary rounded-pill"
                    type="button"
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>

      {/* Reviews Section */}
      <Row className="mt-5">
        <Col md={8}>
          <h3 className="mb-4 fw-bold">Customer Reviews</h3>

          <div className="review-list mb-5">
            {product.reviews && product.reviews.length === 0 && <Alert variant="info">No reviews yet.</Alert>}

            {product.reviews && product.reviews.map((review) => (
              <Card key={review.id} className="mb-3 border-0 shadow-sm review-card">
                <Card.Body>
                  <div className="d-flex justify-content-between mb-2">
                    <strong className="fs-5">{review.name}</strong>
                    <div className="rating-stars text-warning">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>
                  </div>
                  <p className="text-muted small mb-2">{review.createdAt?.substring(0, 10)}</p>
                  <Card.Text>{review.comment}</Card.Text>
                </Card.Body>
              </Card>
            ))}
          </div>

          <Card className="review-form-card shadow-premium border-0">
            <Card.Body className="p-4">
              <h4 className="mb-3 fw-bold">Write a Customer Review</h4>
              {userInfo ? (
                <Form onSubmit={submitReviewHandler}>
                  {reviewError && <Alert variant="danger">{reviewError}</Alert>}

                  <Form.Group className="mb-3" controlId="rating">
                    <Form.Label>Rating</Form.Label>
                    <Form.Select value={rating} onChange={(e) => setRating(e.target.value)}>
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

                  <Button type="submit" variant="primary">
                    Submit Review
                  </Button>
                </Form>
              ) : (
                <Alert variant="warning">
                  Please <Link to="/login">login</Link> to write a review
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ProductDetailScreen;
