import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Navbar as BNavbar, Nav, Container, NavDropdown, Button, Form, InputGroup } from "react-bootstrap";
import { logout } from "../reducers/authReducers";
import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [keyword, setKeyword] = useState("");

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?keyword=${keyword}`);
    } else {
      navigate("/");
    }
  };

  return (
    <BNavbar bg="dark" variant="dark" expand="lg" collapseOnSelect className="py-3 shadow-lg">
      <Container>
        <BNavbar.Brand as={Link} to="/" className="fw-bold fs-3 text-warning">
          Cartify
        </BNavbar.Brand>
        <BNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BNavbar.Collapse id="basic-navbar-nav">
          <Form className="d-flex mx-auto my-2 my-lg-0 w-50" onSubmit={submitHandler}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search products..."
                className="search-input"
                onChange={(e) => setKeyword(e.target.value)}
              />
              <Button variant="warning" type="submit">
                <i className="fas fa-search"></i>
              </Button>
            </InputGroup>
          </Form>

          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/" className="text-light mx-2">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/cart" className="text-light mx-2">
              <i className="fas fa-shopping-cart"></i> Cart
            </Nav.Link>

            {userInfo ? (
              <NavDropdown title={<span><i className="fas fa-user-circle me-1"></i> {userInfo.first_name || userInfo.name || userInfo.username || "User"}</span>} id="username" className="mx-2 profile-dropdown">
                <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/my-addresses">My Addresses</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/orders">My Orders</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="text-danger">Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Button
                as={Link}
                to="/login"
                variant="outline-warning"
                size="sm"
                className="mx-2 px-3 fw-bold text-decoration-none"
              >
                Login
              </Button>
            )}
          </Nav>
        </BNavbar.Collapse>
      </Container>
    </BNavbar>
  );
}

export default Navbar;
