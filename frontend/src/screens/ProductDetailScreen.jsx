import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../actions/cartActions";
import './ProductDetailScreen.css';

function ProductDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);

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

  const addToCartHandler = () => {
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
      fetchProduct(); // Refresh to show new review
    } catch (err) {
      setReviewError(err.response?.data?.detail || err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found.</p>;

  const imageUrl = product.image_url || (product.image ? `http://127.0.0.1:8000${product.image}` : null);

  return (
    <div className="container product-detail">
      <Link className="back-btn" to="/">← Back to results</Link>

      <div className="product-detail-grid">

        {/* 1. Image Column */}
        <div className="product-image-col">
          <img src={imageUrl || '/placeholder.svg'} alt={product.name} className="product-large-img" />
        </div>

        {/* 2. Info Column */}
        <div className="product-info-col">
          <h2>{product.name}</h2>

          <div className="product-rating">
            <span className="rating-stars">
              {"★".repeat(Math.round(product.rating || 0))}
              {"☆".repeat(5 - Math.round(product.rating || 0))}
            </span>
            <span className="rating-count">{product.numReviews} ratings</span>
          </div>

          <div className="product-price-block">
            <div className="detail-price">
              <span>₹</span>{product.price}
            </div>
          </div>

          <div className="product-description">
            <p>{product.description}</p>
          </div>
        </div>

        {/* 3. Buy Box Column */}
        <div className="buy-box-col">
          <div className="price-row">₹{product.price}</div>

          <div className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </div>

          {product.stock > 0 && (
            <>
              <div className="qty-select">
                <select value={qty} onChange={(e) => setQty(e.target.value)}>
                  {[...Array(product.stock).keys()].slice(0, 10).map((x) => (
                    <option key={x + 1} value={x + 1}>
                      Qty: {x + 1}
                    </option>
                  ))}
                </select>
              </div>

              <button onClick={addToCartHandler} className="btn-add-to-cart">
                Add to Cart
              </button>
              <button className="btn-buy-now">Buy Now</button>
            </>
          )}
        </div>

      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h3>Customer Reviews</h3>

        {product.reviews && product.reviews.length === 0 && <p>No reviews yet.</p>}

        {product.reviews && product.reviews.map((review) => (
          <div key={review.id} className="review-item">
            <div className="review-header">
              <strong>{review.name}</strong>
              <span className="rating-stars">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </span>
            </div>
            <p className="review-date">{review.createdAt?.substring(0, 10)}</p>
            <p className="review-comment">{review.comment}</p>
          </div>
        ))}

        {/* Review Form */}
        <div className="review-form">
          <h4>Write a Customer Review</h4>
          {userInfo ? (
            <form onSubmit={submitReviewHandler}>
              {reviewError && <p style={{ color: 'red' }}>{reviewError}</p>}

              <label>Rating</label>
              <select value={rating} onChange={(e) => setRating(e.target.value)}>
                <option value="">Select...</option>
                <option value="1">1 - Poor</option>
                <option value="2">2 - Fair</option>
                <option value="3">3 - Good</option>
                <option value="4">4 - Very Good</option>
                <option value="5">5 - Excellent</option>
              </select>

              <label>Comment</label>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)}></textarea>

              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          ) : (
            <p>Please <Link to="/login">login</Link> to write a review</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetailScreen;
