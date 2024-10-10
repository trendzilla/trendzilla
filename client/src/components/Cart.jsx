import React from "react";
import { useNavigate } from "react-router-dom";

const Cart = ({ cartItems, updateQuantity, removeFromCart }) => {
  const TAX_RATE = 0.1;
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = subtotal * TAX_RATE;
    return subtotal + tax;
  };

  const handleCheckout = () => {
    if (isLoggedIn) {
      navigate("/checkout"); 
    } else {
      navigate("/login"); 
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <div className="max-w-3xl mx-auto">
          {cartItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b py-4"
            >
              <div className="w-24">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
              <div className="flex-1 ml-4">
                <h2 className="text-lg font-bold">{item.name}</h2>
                <p>
                  ${item.price.toFixed(2)} x {item.quantity}
                </p>
                <div className="flex items-center">
                  <button
                    onClick={() => updateQuantity(item, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-200"
                  >
                    -
                  </button>
                  <span className="px-4">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-200"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-8 text-center">
            <h2 className="text-xl font-bold">
              Subtotal: ${calculateSubtotal().toFixed(2)}
            </h2>
            <h2 className="text-lg">
              Tax: ${(calculateSubtotal() * TAX_RATE).toFixed(2)}
            </h2>
            <h2 className="text-xl font-bold">
              Total: ${calculateTotal().toFixed(2)}
            </h2>
          </div>

          <button
            onClick={handleCheckout}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full transition-colors block mx-auto"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
