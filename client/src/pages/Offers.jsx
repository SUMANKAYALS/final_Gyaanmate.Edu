import React from 'react';
import { Link } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import { useCart } from '../context/CartContext';
import { FaShoppingCart } from 'react-icons/fa';

const Offers = () => {
  const { products } = useSearch();
  const { addToCart } = useCart();
  
  // Filter products that have offers/discounts
  const offerProducts = products.filter(product => 
    product.discount > 0
  );

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  if (offerProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <FaShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-600 mb-2">No Special Offers Available</h2>
        <p className="text-gray-500 mb-4">Check back later for exciting deals and discounts!</p>
        <Link to="/" className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Special Offers</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {offerProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <Link to={`/product/${product.id}`} className="block">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full font-semibold">
                  {product.discount}% OFF
                </div>
              </div>
            </Link>
            <div className="p-4">
              <Link to={`/product/${product.id}`} className="block">
                <h3 className="text-lg font-semibold mb-2 hover:text-blue-600">{product.name}</h3>
                <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
              </Link>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-lg font-bold text-blue-600">
                    ${(product.price * (1 - product.discount/100)).toFixed(2)}
                  </span>
                  <span className="text-gray-500 line-through ml-2">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                {product.stock > 0 ? (
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
                  >
                    Add to Cart
                  </button>
                ) : (
                  <span className="text-red-500 font-medium">Out of Stock</span>
                )}
              </div>
              {product.stock > 0 && product.stock <= 5 && (
                <p className="text-orange-500 text-sm mt-2">
                  Only {product.stock} left in stock!
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offers; 