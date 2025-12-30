import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, ListGroup } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../reducers/authReducers";
import "./ProfileScreen.css";

function ProfileScreen() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.auth);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    useEffect(() => {
        if (!userInfo) {
            navigate("/login");
        } else {
            setName(userInfo.name || userInfo.first_name || "User");
            setEmail(userInfo.email || "No Email");
        }
    }, [navigate, userInfo]);

    return (
        <Container className="py-5-custom">
            <Row>
                <Col md={4} className="mb-4">
                    <Card className="border-0 shadow-premium overflow-hidden">
                        <div className="profile-header">
                            <div className="profile-avatar">
                                {name.charAt(0).toUpperCase()}
                            </div>
                            <small className="fw-bold text-white-50 text-uppercase letter-spacing-2">Hello,</small>
                            <h2 className="fw-bold text-white mt-1">{name}</h2>
                        </div>

                        <div className="px-4 py-2 text-muted fw-bold small mt-2">MY ACCOUNT</div>
                        <ListGroup variant="flush">
                            <ListGroup.Item action className="border-0 py-3 active-profile-link" active>
                                <i className="fas fa-user me-3"></i> Profile Information
                            </ListGroup.Item>
                            <ListGroup.Item action className="border-0 py-3">
                                <i className="fas fa-lock me-3"></i> Change Password
                            </ListGroup.Item>
                        </ListGroup>

                        <div className="px-4 py-2 text-muted fw-bold small mt-3">MY STUFF</div>
                        <ListGroup variant="flush">
                            <ListGroup.Item action onClick={() => navigate('/cart')} className="border-0 py-3">
                                <i className="fas fa-shopping-cart me-3"></i> My Cart
                            </ListGroup.Item>
                            <ListGroup.Item action onClick={() => navigate('/orders')} className="border-0 py-3">
                                <i className="fas fa-box me-3"></i> My Orders
                            </ListGroup.Item>
                            <ListGroup.Item action onClick={() => navigate('/my-addresses')} className="border-0 py-3">
                                <i className="fas fa-map-marker-alt me-3"></i> My Addresses
                            </ListGroup.Item>
                            {/* Wishlist removed as per request */}
                            <ListGroup.Item action onClick={handleLogout} className="border-0 py-3 text-danger">
                                <i className="fas fa-sign-out-alt me-3"></i> Logout
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>

                <Col md={8}>
                    <Card className="border-0 shadow-sm p-4 h-100">
                        <h3 className="fw-bold text-primary mb-4">Personal Information</h3>

                        <Form>
                            <Form.Group className="mb-3" controlId="name">
                                <Form.Label className="text-muted small fw-bold">USERNAME</Form.Label>
                                <Form.Control
                                    type="text"
                                    className="border-0 border-bottom rounded-0 px-0 fw-bold"
                                    value={name}
                                    readOnly
                                />
                            </Form.Group>

                            <Form.Group className="mb-4" controlId="email">
                                <Form.Label className="text-muted small fw-bold">EMAIL</Form.Label>
                                <Form.Control
                                    type="email"
                                    className="border-0 border-bottom rounded-0 px-0 fw-bold"
                                    value={email}
                                    readOnly
                                />
                            </Form.Group>
                        </Form>

                        <h3 className="fw-bold text-primary mb-4 mt-4">Settings</h3>

                        <div className="bg-light p-4 rounded-3 mb-3">
                            <div className="d-flex align-items-center mb-3">
                                <div className="display-6 text-primary me-3"><i className="fas fa-globe"></i></div>
                                <div className="flex-grow-1">
                                    <h5 className="fw-bold mb-1">Language</h5>
                                    <p className="text-muted small mb-0">Choose your preferred language</p>
                                </div>
                            </div>
                            <div className="d-flex gap-2">
                                <Button variant="primary" size="sm" className="rounded-pill px-3">English</Button>
                                <Button variant="outline-primary" size="sm" className="rounded-pill px-3">Hindi</Button>
                                <Button variant="outline-primary" size="sm" className="rounded-pill px-3">Spanish</Button>
                            </div>
                        </div>

                        <div className="bg-light p-4 rounded-3">
                            <div className="d-flex align-items-center mb-3">
                                <div className="display-6 text-warning me-3"><i className="fas fa-bell"></i></div>
                                <div className="flex-grow-1">
                                    <h5 className="fw-bold mb-1">Notifications</h5>
                                    <p className="text-muted small mb-0">Manage your preferences</p>
                                </div>
                            </div>
                            <Form.Check type="checkbox" label="Order updates" defaultChecked className="mb-2" />
                            <Form.Check type="checkbox" label="Promotional emails" defaultChecked className="mb-2" />
                            <Form.Check type="checkbox" label="SMS notifications" />
                        </div>

                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default ProfileScreen;
