import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col, Card, Container, Alert, Spinner } from "react-bootstrap";
import { login } from "../actions/authActions";
import './LoginScreen.css';

function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
    dispatch(login(username, password));
  };

  return (
    <div className="login-screen-wrapper">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={6} lg={5}>
            <Card className="shadow-premium login-card">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold fs-3">Welcome Back</h2>
                  <p className="text-muted">Sign in to continue to your account</p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}
                {loading && (
                  <div className="text-center mb-3">
                    <Spinner animation="border" variant="primary" />
                  </div>
                )}

                <Form onSubmit={submitHandler}>
                  <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100 py-2 mb-3">
                    Sign In
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <p className="text-muted">
                    New Customer?{' '}
                    <Link to="/register" className="fw-semibold">
                      Register Now
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

export default LoginScreen;
