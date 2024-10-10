import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { FaCcVisa, FaCcMastercard, FaCcAmex } from "react-icons/fa";

const stripePromise = loadStripe(
  "pk_test_51Q52zpBTE1qi6bauGGEmMVQt5WtYHe6N8T4m3N1Tv2cHg1eRmdM316qVtdn2ZR9xqbKe9rfjsh3RYzXBAbtz87Ow00nkUi1QKX"
);

const Checkout = ({ cartItems, clearCart }) => {
  const TAX_RATE = 0.1;

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

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      <div className="flex justify-between">
        {/* Order Details Section */}
        <div className="w-full md:w-1/2 border-r pr-8">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          {cartItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="w-16 h-16 mr-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{item.name}</h3>
                  <p>
                    {item.quantity} x ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <p>${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}

          <div className="border-t pt-4">
            <p className="text-lg font-semibold">
              Subtotal: ${calculateSubtotal().toFixed(2)}
            </p>
            <p className="text-lg font-semibold">
              Tax (10%): ${(calculateSubtotal() * TAX_RATE).toFixed(2)}
            </p>
            <h2 className="text-xl font-bold mt-2">
              Total: ${calculateTotal().toFixed(2)}
            </h2>
          </div>
        </div>

        {/* Payment Form Section */}
        <div className="w-full md:w-1/2 pl-8">
          <h2 className="text-xl font-bold mb-4">Pay with Card</h2>

          {/* Payment form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Elements stripe={stripePromise}>
              <CheckoutForm
                total={calculateTotal()}
                cartItems={cartItems}
                clearCart={clearCart}
              />{" "}
              {/* Passing clearCart */}
            </Elements>

            {/* Card Icons */}
            <div className="flex justify-start items-center mt-4">
              <FaCcVisa className="text-2xl mr-2 text-gray-500" />
              <FaCcMastercard className="text-2xl mr-2 text-gray-500" />
              <FaCcAmex className="text-2xl text-gray-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
