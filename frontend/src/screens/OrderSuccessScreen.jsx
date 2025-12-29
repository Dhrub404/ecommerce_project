import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import api from "../api/axios";

function OrderSuccessScreen() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                // Assuming we have an endpoint to get a single order, or we just trust the ID for now.
                // If we don't have a single order endpoint yet, we might need to add one or just display the ID.
                // User requirement: "shows order placed with total amount".
                // We likely need to fetch the order details.
                // Existing endpoints: GET /orders/ (list).
                // DO we have GET /orders/:id? Let's check backend urls or just try to fetch it.
                // If not, we can implement it or filter from the list. 
                // For now, let's try to fetch it, if it fails, we show generic info.

                // EDIT: I should check if I have a single order endpoint.
                // Looking at previous logs/files, I don't recall seeing a specific detail view for orders, only 'orders/' (list).
                // I will assume for now I should implement it or stick to showing just the ID if I can't fetch.
                // BUT, better user experience is showing total.
                // Let's rely on fetching the list and finding the order if specific endpoint doesn't exist? No, that's inefficient.
                // Best bet: The backend CreateOrderView returns the full order data. 
                // Maybe I should pass the state via location.state? 
                // That's prone to issues if user refreshes.
                // Safe bet: Fetch order from backend. 
                // I will add a simple useEffect to fetch order details. If endpoint missing, I'll add it to backend task.
                // Wait, I am in Frontend task mode implicitly.
                // Let's look at Order actions... fetchOrders() gets all. 
                // Let's try to get it from the list for now if I can't verify the endpoint.
                // actually, I'll just write the code to fetch `/orders/${id}/` and if it 404s, I'll fix the backend.

                const { data } = await api.get(`orders/${id}/`);
                setOrder(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch order", error);
                setLoading(false);
            }
        };

        if (id) {
            fetchOrder();
        }
    }, [id]);

    return (
        <Container className="py-5-custom text-center">
            <Card className="shadow-premium border-0 p-5 mx-auto" style={{ maxWidth: '600px' }}>
                <div className="mb-4">
                    <i className="fas fa-check-circle text-success" style={{ fontSize: '5rem' }}></i>
                </div>
                <h2 className="fw-bold mb-3">Order Placed Successfully!</h2>
                <p className="text-muted mb-4">Thank you for your purchase. Your order has been confirmed.</p>

                {loading ? <p>Loading order details...</p> : order ? (
                    <div className="bg-light p-3 rounded mb-4">
                        <Row className="mb-2">
                            <Col xs={6} className="text-start text-muted">Order ID:</Col>
                            <Col xs={6} className="text-end fw-bold">#{order.id}</Col>
                        </Row>
                        <Row className="mb-2">
                            <Col xs={6} className="text-start text-muted">Date:</Col>
                            <Col xs={6} className="text-end fw-bold">{new Date(order.created_at).toLocaleDateString()}</Col>
                        </Row>
                        <Row>
                            <Col xs={6} className="text-start text-muted">Total Amount:</Col>
                            <Col xs={6} className="text-end fw-bold fs-5 text-primary">₹{order.total_price}</Col>
                        </Row>
                    </div>
                ) : (
                    <p>Order details not available.</p>
                )}

                <div className="d-grid gap-2">
                    <Link to="/" className="btn btn-primary btn-lg rounded-pill">
                        Continue Shopping
                    </Link>
                    <Link to="/orders" className="btn btn-outline-secondary btn-lg rounded-pill">
                        View My Orders
                    </Link>
                </div>
            </Card>
        </Container>
    );
}

export default OrderSuccessScreen;
