import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProductListScreen from "./screens/ProductListScreen";
import ProductDetailScreen from "./screens/ProductDetailScreen";
import CartScreen from "./screens/CartScreen";
import OrderScreen from "./screens/OrderScreen";


function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/product/:id" element={<ProductDetailScreen />} />
        <Route path="/" element={<ProductListScreen />} />
        <Route path="/cart" element={<CartScreen />} />
        <Route path="/orders" element={<OrderScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
