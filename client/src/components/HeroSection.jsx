import React from "react";
import heroImage from "../assets/background-img.webp"; 

const HeroSection = () => {
  return (
    <section className="relative bg-green-100 h-screen flex items-center justify-start -mt-10">
      {/* Background Image with Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover", 
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>{" "}
        {/* Dark overlay */}
      </div>

      {/* Text Content */}
      <div className="relative z-10 text-left max-w-2xl p-8 ml-12 md:ml-20 lg:ml-32 animate-fade-in-left-box">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-white">
          STEP INTO STYLE WITH TRENDZILLA
        </h1>
        <p className="text-xl md:text-2xl mb-6 text-gray-200">
          Discover the latest trends and timeless styles, all in one place.
        </p>
        <a
          href="/shop"
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300"
        >
          Shop Now
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
