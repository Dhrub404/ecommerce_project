import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './WishlistScreen.css'; // We will create this for the heart animation

function WishlistScreen() {
    const [wishlistItems, setWishlistItems] = useState([]);

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('wishlist')) || [];
        setWishlistItems(items);
    }, []);

    const removeFromWishlist = (productId) => {
        const updatedList = wishlistItems.filter(item => item.product !== productId);
        setWishlistItems(updatedList);
        localStorage.setItem('wishlist', JSON.stringify(updatedList));
    };

    return (
        <Container className="py-5" style={{ minHeight: '80vh' }}>
            {wishlistItems.length > 0 && (
                <h2 className="mb-4 fw-bold">My Wishlist ({wishlistItems.length})</h2>
            )}

            {wishlistItems.length === 0 ? (
                <div className="d-flex flex-column align-items-center justify-content-center text-center py-5 h-100 mt-5">
                    <div className="heart-container mb-4">
                        <i className="fas fa-heart text-danger heart-icon-large"></i>
                    </div>

                    <h2 className="fw-bold mb-3 display-6">Your Wishlist is Empty</h2>
                    <p className="text-muted mb-4 lead" style={{ maxWidth: '500px' }}>
                        Add items you love to your wishlist. Review them anytime and easily move them to cart.
                    </p>

                    <Link to="/" className="text-decoration-none">
                        <Button variant="primary" className="rounded-pill px-5 py-2 fw-bold">
                            Continue Shopping
                        </Button>
                    </Link>
                </div>
            ) : (
                <Row>
                    {wishlistItems.map(item => (
                        <Col key={item.product} sm={12} md={6} lg={4} xl={3} className="mb-4">
                            <Card className="h-100 shadow-sm border-0 product-card">
                                <Link to={`/product/${item.product}`} className="text-decoration-none">
                                    <div className="p-3 bg-light rounded-top position-relative" style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                        <Card.Img
                                            variant="top"
                                            // The item.image is now the full URL stored from ProductListScreen
                                            src={item.image || '/placeholder.svg'}
                                            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                                            onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.svg'; }}
                                        />
                                        <div
                                            className="wishlist-remove-btn"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                removeFromWishlist(item.product);
                                            }}
                                            title="Remove from wishlist"
                                        >
                                            <i className="fas fa-times"></i>
                                        </div>
                                    </div>
                                </Link>
                                <Card.Body className="d-flex flex-column">
                                    <Link to={`/product/${item.product}`} className="text-decoration-none text-dark">
                                        <Card.Title className="fs-6 fw-bold text-truncate mb-2">{item.name}</Card.Title>
                                    </Link>
                                    <Card.Text className="fw-bold text-primary mb-3">₹{item.price}</Card.Text>

                                    <div className="mt-auto">
                                        <Link to={`/product/${item.product}`} className="w-100">
                                            <Button variant="outline-primary" size="sm" className="w-100 rounded-pill">
                                                View Product
                                            </Button>
                                        </Link>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}

export default WishlistScreen;
