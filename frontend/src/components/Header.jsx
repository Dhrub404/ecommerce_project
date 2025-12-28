import { Link } from "react-router-dom";

function Header() {
  return (
    <nav className="navbar">
      <h3>E-Commerce</h3>
      <div>
        <Link to="/">Products</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/login">Login</Link>
        <Link to="/orders">Orders</Link>
      </div>
    </nav>
  );
}

export default Header;
