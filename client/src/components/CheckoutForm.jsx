import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { addDoc, collection, db } from "../firebase";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ total, cartItems = [], clearCart }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("email");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        toast.error(error.message);
        setIsProcessing(false);
        return;
      }

      if (!cartItems.length) {
        toast.error("Your cart is empty.");
        setIsProcessing(false);
        return;
      }

      // Save order to Firebase
      try {
        const docRef = await addDoc(collection(db, "orders"), {
          userEmail,
          items: cartItems.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          totalAmount: total,
          createdAt: new Date().toISOString(),
        });

        console.log("Document written with ID: ", docRef.id);
        toast.success("Payment successful! Order added.");

        // Clear the cart after successful payment
        clearCart();

        // Navigate to the orders page
        navigate("/orders");
      } catch (error) {
        console.error("Error saving order: ", error);
        toast.error("Failed to save order. Please try again.");
      }

      setIsProcessing(false);
    } catch (error) {
      toast.error("Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
      <CardElement className="border p-4 rounded-lg mb-4" />
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-full transition-colors"
      >
        {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
