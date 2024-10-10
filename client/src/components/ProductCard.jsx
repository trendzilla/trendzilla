import React, { useState } from "react";

const ProductCard = ({ product, addToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value));
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity }); 
  };

  return (
    <div className="border p-4 rounded-md shadow-md">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-96 object-cover rounded-lg"
      />
      <h2 className="text-lg font-bold">{product.name}</h2>
      <p className="text-gray-500">${product.price.toFixed(2)}</p>

      {/* Quantity Selector */}
      <div className="mt-2">
        <label
          htmlFor={`quantity-${product.id}`}
          className="block text-sm font-medium text-gray-700"
        >
          Quantity
        </label>
        <select
          id={`quantity-${product.id}`}
          value={quantity}
          onChange={handleQuantityChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        >
          {[1, 2, 3, 4, 5].map((qty) => (
            <option key={qty} value={qty}>
              {qty}
            </option>
          ))}
        </select>
      </div>

      <button
        className="mt-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-full transition-colors"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
