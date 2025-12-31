import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Card, Container, Alert, Spinner } from "react-bootstrap";
import { register } from "../actions/authActions";
import './RegisterScreen.css';

function RegisterScreen() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            navigate("/");
        }
    }, [navigate, userInfo]);

    const submitHandler = (e) => {
        e.preventDefault();
        setMessage(null);
        // Dispatch register with 4 fields
        dispatch(register(username, email, password, name));
    };

    return (
        <div className="register-screen-wrapper">
            <Container>
                <Row className="justify-content-center">
                    <Col xs={12} md={8} lg={5}>
                        <Card className="register-card p-4">
                            <Card.Body>
                                <div className="text-center">
                                    <h2 className="register-title fs-2">Sign Up</h2>
                                    <p className="register-subtitle">Create an account to start shopping</p>
                                </div>

                                {message && <Alert variant="danger">{message}</Alert>}
                                {error && <Alert variant="danger">{error}</Alert>}
                                {loading && (
                                    <div className="text-center mb-3">
                                        <Spinner animation="border" variant="primary" />
                                    </div>
                                )}

                                <Form onSubmit={submitHandler}>
                                    <Form.Group className="mb-3" controlId="name">
                                        <Form.Control
                                            type="text"
                                            placeholder="Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            className="register-input"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="email">
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="register-input"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="username">
                                        <Form.Control
                                            type="text"
                                            placeholder="Username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                            className="register-input"
                                        />
                                    </Form.Group>


                                    <Form.Group className="mb-4" controlId="password">
                                        <Form.Control
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="register-input"
                                        />
                                    </Form.Group>

                                    <Button variant="primary" type="submit" className="w-100 btn-register text-white mb-4">
                                        Register
                                    </Button>
                                </Form>

                                <div className="text-center">
                                    <p className="text-muted small mb-0">
                                        Already have an account?{' '}
                                        <Link to="/login" className="login-link">
                                            Log in
                                        </Link>
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default RegisterScreen;
