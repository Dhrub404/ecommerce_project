import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { listProducts } from "../actions/productActions";
import { addToCart, updateCartItem, fetchCart } from "../actions/cartActions";
import './ProductListScreen.css';

function ProductListScreen() {
  const dispatch = useDispatch();
  const cartDispatch = useDispatch();

  const { items, loading, error, page, pageSize, totalPages } = useSelector(
    (state) => state.products
  );

  const { items: cartItems } = useSelector((state) => state.cart);

  const [currentPage, setCurrentPage] = useState(page || 1);
  const perPage = 9; // fixed: show 9 per page
  const totalPagesSafe = totalPages || 1;

  useEffect(() => {
    dispatch(listProducts(currentPage, perPage));
    // ensure cart is loaded so counts show inline
    dispatch(fetchCart());
  }, [dispatch, currentPage]);

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
    const productId = cartItem.product && (cartItem.product.id || cartItem.product._id) ? (cartItem.product.id || cartItem.product._id) : cartItem.product;
    markUpdating(productId);
    try {
      const newQty = cartItem.quantity - 1;
      await cartDispatch(updateCartItem(cartItem.id, newQty));
    } finally {
      unmarkUpdating(productId);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
  };

  return (
    <div className="container products-grid">
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <h2>Products</h2>
      </div>

      <div className="products-list">
        {items.map((product) => {
          const imageUrl = product.image_url || (product.image ? `http://127.0.0.1:8000${product.image}` : null);

          const cartItem = (cartItems || []).find((ci) => ci.product && (ci.product.id === product.id || ci.product._id === product.id));
          const qty = cartItem ? cartItem.quantity : 0;

          return (
            <div key={product.id} className="card product-card">
              <Link to={`/product/${product.id}`} className="card-link">
                {imageUrl && (
                  <div className="image-wrapper">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="product-thumb"
                      style={{ height: '160px', width: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.svg'; }}
                    />
                  </div>
                )}

                <h4 className="product-name">{product.name}</h4>
                <p className="price">₹{product.price}</p>
              </Link>

              {/* Inline quantity control */}
              {qty === 0 ? (
                <button
                  onClick={() => handleAdd(product.id)}
                  className="add-to-cart"
                  disabled={updatingIds.has(product.id)}
                >
                  {updatingIds.has(product.id) ? 'Adding...' : 'Add to Cart'}
                </button>
              ) : (
                <div className="qty-control" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button className="add-to-cart" onClick={() => handleDecrement(cartItem)} disabled={updatingIds.has(product.id)}>-</button>
                  <div style={{ minWidth: 28, textAlign: 'center' }}>{qty}</div>
                  <button className="add-to-cart" onClick={() => handleIncrement(product.id)} disabled={updatingIds.has(product.id)}>+</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

        <div className="pagination" style={{display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20}}>
        <button className="page-btn" onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1}>Prev</button>
        {Array.from({length: totalPagesSafe}).map((_, idx) => {
          const p = idx + 1;
          return (
            <button key={p} onClick={() => goToPage(p)} className={`page-btn ${p === currentPage ? 'active' : ''}`}>{p}</button>
          );
        })}
        <button className="page-btn" onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPagesSafe}>Next</button>
      </div>
    </div>
  );
}

export default ProductListScreen;
