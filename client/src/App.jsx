import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import CountdownTimer from "./components/CountdownTimer"; 
import Shop from "./components/Shop";
import Cart from "./components/Cart";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminDashboard from "./components/AdminDashboard";
import Checkout from "./components/Checkout";
import Orders from "./components/Orders";
import products from "./products";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

function App() {
  const [cartItems, setCartItems] = useState([]);

  
  const addToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, product]);
    }
  };

  const updateQuantity = (product, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(product);
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeFromCart = (product) => {
    setCartItems(cartItems.filter((item) => item.id !== product.id));
  };


  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <Router>
      <AppContent
        cartItems={cartItems}
        addToCart={addToCart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
      />
    </Router>
  );
}

function AppContent({
  cartItems,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
}) {
  const location = useLocation(); 

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      <Header cartItems={cartItems} />
      <div className="pt-20">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection />
                <CountdownTimer /> {/* Add the countdown timer here */}
              </>
            }
          />
          <Route
            path="/shop"
            element={<Shop products={products} addToCart={addToCart} />}
          />
          <Route
            path="/cart"
            element={
              <Cart
                cartItems={cartItems}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
              />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route
            path="/checkout"
            element={<Checkout cartItems={cartItems} clearCart={clearCart} />} 
          />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </div>

      {/* Conditionally render the footer only on the home page */}
      {location.pathname === "/" && <Footer />}
    </>
  );
}

export default App;
