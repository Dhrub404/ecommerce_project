import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../actions/authActions";
import './LoginScreen.css'; // Reusing LoginScreen styles for consistency

function RegisterScreen() {
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
        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
        } else {
            dispatch(register(username, email, password));
        }
    };

    return (
        <form onSubmit={submitHandler}>
            <h2>Register</h2>

            {message && <p style={{ color: 'red' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading && <p>Loading...</p>}

            <input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />

            <button type="submit">Register</button>

            <div style={{ marginTop: '1rem' }}>
                Have an account? <Link to="/login">Login</Link>
            </div>
        </form>
    );
}

export default RegisterScreen;
