import { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card, Alert, Modal } from "react-bootstrap";
import api from "../api/axios";

function AddressListScreen() {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newAddress, setNewAddress] = useState({ address: '', city: '', postal_code: '', country: '' });

    const fetchAddresses = async () => {
        try {
            const { data } = await api.get("orders/addresses/");
            setAddresses(data);
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
            setShowModal(false);
            setNewAddress({ address: '', city: '', postal_code: '', country: '' });
        } catch (error) {
            alert("Error saving address");
        }
    };

    return (
        <Container className="py-5-custom">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">My Addresses</h2>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    <i className="fas fa-plus"></i> Add New
                </Button>
            </div>

            {loading ? <p>Loading...</p> : (
                <Row>
                    {addresses.length === 0 ? (
                        <Alert variant="info">No saved addresses found.</Alert>
                    ) : (
                        addresses.map((addr) => (
                            <Col key={addr.id} md={6} lg={4} className="mb-4">
                                <Card className="h-100 shadow-sm border-0">
                                    <Card.Body>
                                        <Card.Title className="fw-bold fs-5 mb-3">{addr.city}</Card.Title>
                                        <Card.Text>
                                            {addr.address}<br />
                                            {addr.postal_code}, {addr.country}
                                        </Card.Text>
                                        {addr.is_default && <span className="badge bg-success">Default</span>}
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    )}
                </Row>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Address</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreateAddress}>
                        <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" required value={newAddress.address} onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })} />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control type="text" required value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Postal Code</Form.Label>
                                    <Form.Control type="text" required value={newAddress.postal_code} onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Country</Form.Label>
                            <Form.Control type="text" required value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100">Save Address</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default AddressListScreen;
