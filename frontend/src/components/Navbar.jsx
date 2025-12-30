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
    <BNavbar expand="lg" collapseOnSelect className="py-3">
      <Container>
        <BNavbar.Brand as={Link} to="/" className="d-flex flex-column align-items-start py-0">
          <span className="navbar-brand mb-0 lh-1 fst-italic fw-bold" style={{ color: '#6366f1', fontSize: '1.75rem', letterSpacing: '-0.5px' }}>Cartify</span>
          <small className="fst-italic fw-bold" style={{ fontSize: '0.8rem', color: '#64748b' }}>
            GET YOUR <span style={{ color: '#f59e0b' }}>CARTS</span> ✨
          </small>
        </BNavbar.Brand>
        <BNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BNavbar.Collapse id="basic-navbar-nav">
          <Form className="d-flex mx-auto my-3 my-lg-0 w-50 position-relative shadow-sm rounded-pill bg-light" onSubmit={submitHandler}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search for products, brands and more"
                className="border-0 bg-transparent ps-4 py-2"
                onChange={(e) => setKeyword(e.target.value)}
                style={{ boxShadow: 'none', fontSize: '0.95rem' }}
              />
              <Button variant="primary" type="submit" className="rounded-pill m-1 px-4">
                Search
              </Button>
            </InputGroup>
          </Form>

          <Nav className="ms-auto align-items-center gap-3">
            <Nav.Link as={Link} to="/" className="text-center">
              <div className="d-block fs-5 mb-1"><i className="fas fa-home text-primary"></i></div>
              <small className="fw-bold text-dark">Home</small>
            </Nav.Link>

            {userInfo && (
              <>
                <Nav.Link as={Link} to="/orders" className="text-center">
                  <div className="d-block fs-5 mb-1"><i className="fas fa-box" style={{ color: '#d97706' }}></i></div>
                  <small className="fw-bold text-dark">Orders</small>
                </Nav.Link>

                <Nav.Link as={Link} to="/wishlist" className="text-center">
                  <div className="d-block fs-5 mb-1"><i className="fas fa-heart text-danger"></i></div>
                  <small className="fw-bold text-dark">Wishlist</small>
                </Nav.Link>
              </>
            )}

            <Nav.Link as={Link} to="/cart" className="text-center position-relative">
              <div className="d-block fs-5 mb-1"><i className="fas fa-shopping-cart text-info"></i></div>
              <small className="fw-bold text-dark">Cart</small>
            </Nav.Link>

            {userInfo ? (
              <Nav.Link as={Link} to="/profile" className="text-center">
                <div className="d-block fs-5 mb-1"><i className="fas fa-user text-primary"></i></div>
                <small className="fw-bold text-dark">{userInfo.first_name || userInfo.name || "Account"}</small>
              </Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/login" className="text-center">
                <div className="d-block fs-5 mb-1"><i className="fas fa-user text-muted"></i></div>
                <small className="fw-bold text-dark">Login</small>
              </Nav.Link>
            )}
          </Nav>
        </BNavbar.Collapse>
      </Container>
    </BNavbar>
  );
}

export default Navbar;

