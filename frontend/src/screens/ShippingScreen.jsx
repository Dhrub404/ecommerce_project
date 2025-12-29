import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card, Alert } from "react-bootstrap";
import { placeOrder } from "../actions/orderActions";
import api from "../api/axios";

function ShippingScreen() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const { items } = cart;
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [loading, setLoading] = useState(true);

    // New Address Form State
    const [showNewForm, setShowNewForm] = useState(false);
    const [newAddress, setNewAddress] = useState({ address: '', city: '', postal_code: '', country: '' });

    const fetchAddresses = async () => {
        try {
            const { data } = await api.get("orders/addresses/");
            setAddresses(data);
            if (data.length > 0) {
                // specific logic to select default? for now first one
                const defaultAddr = data.find(a => a.is_default);
                setSelectedAddressId(defaultAddr ? defaultAddr.id : data[0].id);
            } else {
                setShowNewForm(true);
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleCreateAddress = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post("orders/addresses/", newAddress);
            setAddresses([...addresses, data]);
            setSelectedAddressId(data.id);
            setShowNewForm(false);
            setNewAddress({ address: '', city: '', postal_code: '', country: '' });
        } catch (error) {
            alert("Error saving address");
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!selectedAddressId) {
            alert("Please select or add an address");
            return;
        }

        const selectedAddr = addresses.find(a => a.id === Number(selectedAddressId));
        if (!selectedAddr) return;

        // Dispatch placeOrder with address details
        // Note: We need to update placeOrder action to accept this data, or pass it directly
        // For now let's update orderActions to take address data
        const order = await dispatch(placeOrder(selectedAddr));
        if (order) {
            navigate(`/order-success/${order.id}`);
        }
    };

    if (loading) return <Container className="py-5"><p>Loading addresses...</p></Container>;

    return (
        <Container className="py-5-custom">
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <Card className="shadow-premium border-0 p-4">
                        <h2 className="mb-4 fw-bold">Checkout & confirm</h2>

                        <Form onSubmit={submitHandler}>
                            {addresses.length > 0 && (
                                <div className="mb-4">
                                    <h5 className="mb-3">Select a saved address:</h5>
                                    {addresses.map((addr) => (
                                        <Card
                                            key={addr.id}
                                            className={`mb-3 cursor-pointer ${selectedAddressId === addr.id ? 'border-primary bg-light' : ''}`}
                                            onClick={() => setSelectedAddressId(addr.id)}
                                            style={{ cursor: 'pointer', borderWidth: selectedAddressId === addr.id ? '2px' : '1px' }}
                                        >
                                            <Card.Body>
                                                <Form.Check
                                                    type="radio"
                                                    id={`addr-${addr.id}`}
                                                    label={`${addr.address}, ${addr.city}, ${addr.country} - ${addr.postal_code}`}
                                                    checked={selectedAddressId === addr.id}
                                                    onChange={() => setSelectedAddressId(addr.id)}
                                                />
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>
                            )}

                            <div className="mb-4">
                                <Button variant="outline-primary" onClick={() => setShowNewForm(!showNewForm)}>
                                    {showNewForm ? "Cancel Adding Address" : "Add New Address"}
                                </Button>
                            </div>

                            {showNewForm && (
                                <Card className="mb-4 bg-light border-0">
                                    <Card.Body>
                                        <div className="mb-3">
                                            <Form.Label>Address</Form.Label>
                                            <Form.Control type="text" required value={newAddress.address} onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })} />
                                        </div>
                                        <Row>
                                            <Col md={4}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>City</Form.Label>
                                                    <Form.Control type="text" required value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Postal Code</Form.Label>
                                                    <Form.Control type="text" required value={newAddress.postal_code} onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })} />
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Country</Form.Label>
                                                    <Form.Control type="text" required value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Button variant="success" onClick={handleCreateAddress}>Save Address</Button>
                                    </Card.Body>
                                </Card>
                            )}

                            <div className="border-top pt-3 mt-3 mb-4">
                                <h4 className="fw-bold mb-3">Order Summary</h4>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Items:</span>
                                    <span>{items.reduce((acc, item) => acc + item.quantity, 0)}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fw-bold fs-5">Total Amount:</span>
                                    <span className="fw-bold fs-4 text-primary">
                                        ₹{items.reduce((acc, item) => acc + item.quantity * item.product.price, 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <Button type="submit" variant="success" className="w-100 py-3 mt-2 fw-bold" size="lg" disabled={!selectedAddressId && !showNewForm}>
                                Place Order
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default ShippingScreen;
