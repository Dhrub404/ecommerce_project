import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Container, Card, Row, Col, Button, Image } from "react-bootstrap";
import api from "../api/axios";
import "./OrderSuccessScreen.css";

function OrderSuccessScreen() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!id) return;
            try {
                const { data } = await api.get(`orders/${id}/`);
                setOrder(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch order", error);
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const getImageUrl = (path) => {
        if (!path) return '/placeholder.svg';
        if (path.startsWith('http')) return path;
        return `http://127.0.0.1:8000${path}`;
    };

    if (loading) return (
        <Container className="py-5 text-center" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </Container>
    );

    if (!order) return (
        <Container className="py-5 text-center">
            <h3>Order not found</h3>
            <Link to="/">Go Home</Link>
        </Container>
    );

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <Container className="py-5 text-center">
                {/* Top Success Animation */}
                <div className="success-icon-wrapper">
                    <div className="success-icon-circle">
                        <i className="fas fa-check success-icon-check"></i>
                    </div>
                </div>

                <h1 className="display-5 fw-bold order-success-title">Order Placed Successfully! 🎉</h1>
                <p className="order-success-subtitle">
                    Thank you for your order. We've received your order and will process it shortly.
                </p>

                {/* Order Details Card */}
                <Card className="order-details-card mx-auto mb-5" style={{ maxWidth: '700px' }}>
                    <Card.Body className="p-4 p-md-5">
                        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                            <h3 className="fw-bold mb-0 text-dark">Order Details</h3>
                            <span className="order-id-badge">Order ID: #{order.id}</span>
                        </div>

                        <div className="mb-4">
                            <Row className="mb-3">
                                <Col xs={6} className="text-start order-info-label">Order Date:</Col>
                                <Col xs={6} className="text-end order-info-value">{new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</Col>
                            </Row>
                            <Row className="mb-3">
                                <Col xs={6} className="text-start order-info-label">Expected Delivery:</Col>
                                <Col xs={6} className="text-end order-info-value">
                                    {/* Mock Delivery Date: +7 days */}
                                    {new Date(new Date(order.created_at).setDate(new Date(order.created_at).getDate() + 7)).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col xs={6} className="text-start order-info-label">Total Items:</Col>
                                <Col xs={6} className="text-end order-info-value">{order.items ? order.items.length : 0}</Col>
                            </Row>
                            <Row className="mt-4 pt-3 border-top">
                                <Col xs={6} className="text-start fw-bold fs-5 text-primary">Total Amount:</Col>
                                <Col xs={6} className="text-end total-amount-value">₹{order.total_price}</Col>
                            </Row>
                        </div>

                        {/* Items Ordered Section */}
                        {order.items && order.items.length > 0 && (
                            <div className="text-start mt-5">
                                <h5 className="fw-bold mb-3">Items Ordered</h5>
                                <div className="items-ordered-section">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="ordered-item-card">
                                            <div className="item-img-box">
                                                <Image
                                                    src={getImageUrl(item.product.image_url)}
                                                    alt={item.product.name}
                                                    className="item-img"
                                                />
                                            </div>
                                            <div className="flex-grow-1">
                                                <h6 className="fw-bold mb-1">{item.product.name}</h6>
                                                <small className="text-muted">Qty: {item.quantity} × ₹{item.price}</small>
                                            </div>
                                            <div className="text-end">
                                                <span className="fw-bold text-primary">₹{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </Card.Body>
                </Card>

                {/* Footer Buttons */}
                <div className="d-flex justify-content-center gap-3 mb-5">
                    <Link to="/orders">
                        <Button className="success-btn-primary rounded-pill">View All Orders</Button>
                    </Link>
                    <Link to="/">
                        <Button className="success-btn-outline rounded-pill">Continue Shopping</Button>
                    </Link>
                </div>

            </Container>
        </div>
    );
}

export default OrderSuccessScreen;
