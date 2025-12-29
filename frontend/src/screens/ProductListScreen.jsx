import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { Container, Row, Col, Card, Button, Pagination } from "react-bootstrap";
import { listProducts } from "../actions/productActions";
import { addToCart, updateCartItem, fetchCart } from "../actions/cartActions";
import './ProductListScreen.css';

function ProductListScreen() {
  const dispatch = useDispatch();
  const cartDispatch = useDispatch();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get('keyword') || '';

  const { items, loading, error, page, totalPages } = useSelector(
    (state) => state.products
  );

  const { items: cartItems } = useSelector((state) => state.cart);

  const [currentPage, setCurrentPage] = useState(page || 1);
  const perPage = 8; // Adjust for 4-column grid (e.g. 8 or 12)
  const totalPagesSafe = totalPages || 1;

  useEffect(() => {
    dispatch(listProducts(currentPage, perPage, keyword));
    dispatch(fetchCart());
  }, [dispatch, currentPage, keyword]);

  const [updatingIds, setUpdatingIds] = useState(new Set());

  const markUpdating = (id) => setUpdatingIds((s) => new Set([...s, id]));
  const unmarkUpdating = (id) => setUpdatingIds((s) => {
    const ns = new Set(s); ns.delete(id); return ns;
  });

  const handleAdd = async (productId) => {
    markUpdating(productId);
    try {
      await cartDispatch(addToCart(productId, 1));
    } finally {
      unmarkUpdating(productId);
    }
  };

  const handleIncrement = async (productId) => {
    markUpdating(productId);
    try {
      await cartDispatch(addToCart(productId, 1));
    } finally {
      unmarkUpdating(productId);
    }
  };

  const handleDecrement = async (cartItem) => {
    const productId = cartItem.product && (cartItem.product.id || cartItem.product._id) ?
      (cartItem.product.id || cartItem.product._id) : cartItem.product;
    markUpdating(productId);
    try {
      const newQty = cartItem.quantity - 1;
      await cartDispatch(updateCartItem(cartItem.id, newQty));
    } finally {
      unmarkUpdating(productId);
    }
  };

  if (loading) return (
    <Container className="py-5 text-center">
      <h2>Loading...</h2>
    </Container>
  );

  if (error) return (
    <Container className="py-5 text-center">
      <h2 className="text-danger">{error}</h2>
    </Container>
  );

  const goToPage = (p) => {
    if (p < 1 || p > totalPagesSafe) return;
    setCurrentPage(p);
  };

  return (
    <Container className="py-5-custom product-list-container">
      <div className="text-center mb-5">
        <h2 className="fw-bold display-6">Featured Collection</h2>
        <p className="text-muted">Explore our curated selection of premium products</p>
      </div>

      <Row>
        {Array.isArray(items) && items.map((product) => {
          const imageUrl = product.image_url || (product.image ? `http://127.0.0.1:8000${product.image}` : null);
          const cartItem = (cartItems || []).find((ci) => ci.product && (ci.product.id === product.id || ci.product._id === product.id));
          const qty = cartItem ? cartItem.quantity : 0;
          const isUpdating = updatingIds.has(product.id);

          return (
            <Col key={product.id} sm={12} md={6} lg={4} xl={3} className="mb-4">
              <Card className="product-card h-100 shadow-premium border-0">
                <Link to={`/product/${product.id}`} className="text-decoration-none">
                  <div className="card-img-wrapper">
                    <Card.Img
                      variant="top"
                      src={imageUrl || '/placeholder.svg'}
                      className="product-img"
                      onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.svg'; }}
                    />
                  </div>
                </Link>

                <Card.Body className="d-flex flex-column">
                  <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                    <Card.Title className="product-title mb-2">{product.name}</Card.Title>
                  </Link>

                  <h5 className="product-price mb-3">₹{product.price}</h5>

                  <div className="mt-auto">
                    {qty === 0 ? (
                      <Button
                        variant="primary"
                        className="w-100 rounded-pill"
                        onClick={() => handleAdd(product.id)}
                        disabled={isUpdating}
                      >
                        {isUpdating ? 'Adding...' : 'Add to Cart'}
                      </Button>
                    ) : (
                      <div className="d-flex align-items-center justify-content-between qty-control bg-light rounded-pill p-1">
                        <Button
                          variant="link"
                          size="sm"
                          className="text-decoration-none text-dark fw-bold px-3"
                          onClick={() => handleDecrement(cartItem)}
                          disabled={isUpdating}
                        >
                          -
                        </Button>
                        <span className="fw-bold">{qty}</span>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-decoration-none text-dark fw-bold px-3"
                          onClick={() => handleIncrement(product.id)}
                          disabled={isUpdating}
                        >
                          +
                        </Button>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
        {(!Array.isArray(items) || items.length === 0) && (
          <Col className="text-center py-5">
            <h4>No products found</h4>
          </Col>
        )}
      </Row>

      {totalPagesSafe > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.Prev onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1} />
            {Array.from({ length: totalPagesSafe }).map((_, idx) => {
              const p = idx + 1;
              return (
                <Pagination.Item key={p} active={p === currentPage} onClick={() => goToPage(p)}>
                  {p}
                </Pagination.Item>
              );
            })}
            <Pagination.Next onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPagesSafe} />
          </Pagination>
        </div>
      )}
    </Container>
  );
}

export default ProductListScreen;
