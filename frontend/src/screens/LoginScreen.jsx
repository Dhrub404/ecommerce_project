import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
    <form onSubmit={submitHandler}>
      <h2>Login</h2>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>

      <div style={{ marginTop: '1rem' }}>
        New Customer? <Link to="/register">Register</Link>
      </div>
    </form>
  );
}

export default LoginScreen;
