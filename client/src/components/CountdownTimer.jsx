import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/bg1.jpg"; 
const CountdownTimer = () => {
 
  const randomDays = Math.floor(Math.random() * 6) + 5;

  
  const [endDate] = useState(() => {
    const now = new Date();
    now.setDate(now.getDate() + randomDays);
    return now;
  });

  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const distance = endDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });

      if (distance < 0) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);  
  }, [endDate]);

  return (
    <section className="h-screen flex justify-center items-center bg-green-100">
      <div className="flex justify-between items-center container mx-auto p-6">
        {/* Image Section */}
        <div className="w-1/2">
          <img
            src={heroImage}
            alt="Exclusive Offer"
            className="w-full h-auto rounded-lg shadow-lg object-cover"
          />
        </div>

        {/* Timer Section */}
        <div className="w-1/2 pl-8">
          <h1 className="text-4xl font-bold mb-4">Exclusive offer</h1>
          <p className="text-lg mb-6">
            Unlock the ultimate style upgrade with our exclusive offer. Enjoy
            savings of up to 40% on our latest New Arrivals.
          </p>

          <div className="flex space-x-4 mb-6">
            {/* Days */}
            <div className="text-center p-4 bg-white shadow-lg rounded-lg">
              <p className="text-3xl font-bold">{timeLeft.days || 0}</p>
              <p className="text-sm">Days</p>
            </div>
            {/* Hours */}
            <div className="text-center p-4 bg-white shadow-lg rounded-lg">
              <p className="text-3xl font-bold">{timeLeft.hours || 0}</p>
              <p className="text-sm">Hours</p>
            </div>
            {/* Minutes */}
            <div className="text-center p-4 bg-white shadow-lg rounded-lg">
              <p className="text-3xl font-bold">{timeLeft.minutes || 0}</p>
              <p className="text-sm">Minutes</p>
            </div>
            {/* Seconds */}
            <div className="text-center p-4 bg-white shadow-lg rounded-lg">
              <p className="text-3xl font-bold">{timeLeft.seconds || 0}</p>
              <p className="text-sm">Seconds</p>
            </div>
          </div>

          {/* Buy Now Button */}
          <Link
            to="/shop"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CountdownTimer;
