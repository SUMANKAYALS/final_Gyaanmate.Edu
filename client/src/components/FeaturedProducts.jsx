import React from 'react';
import { FaStar, FaRegStar, FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { products as allProducts } from '../data/products';

const FeaturedProducts = () => {
  const { addToCart } = useCart();

  // Select featured products (first 4 products with highest discount)
  const featuredProducts = allProducts
    .sort((a, b) => (b.discount || 0) - (a.discount || 0))
    .slice(0, 4);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {featuredProducts.map((product) => (
            <div key={product.id} className="group relative">
              <Link to={`/product/${product.id}`}>
                <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-center object-cover"
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded">
                      {product.discount}% OFF
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-gray-900">
                        ${(product.price * (1 - (product.discount || 0) / 100)).toFixed(2)}
                      </span>
                      {product.discount > 0 && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {product.stock <= 5 && (
                      <span className="text-sm text-red-600">Only {product.stock} left!</span>
                    )}
                  </div>
                </div>
              </Link>
              <button
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
                className={`mt-4 w-full py-2 px-4 rounded-md flex items-center justify-center ${
                  product.stock === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <FaShoppingCart className="mr-2" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts; 