import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import { FaSearch, FaSadTear } from 'react-icons/fa';
// import { StarIcon } from '@heroicons/react/20/solid';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchResults, searchQuery, searchProducts, isLoading } = useSearch();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');
    if (query) {
      searchProducts(query);
    }
  }, [location.search, searchProducts]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Searching for products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
          Search Results for "{searchQuery}"
        </h1>

        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {searchResults.map((product) => (
              <div
                key={product.id}
                className="group relative bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-center object-cover"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                  <p className="mt-2 text-lg font-semibold text-gray-900">
                    ${product.price}
                    {product.discount > 0 && (
                      <span className="ml-2 text-sm text-green-600">
                        {product.discount}% off
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <FaSadTear className="h-16 w-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-medium text-gray-900">No products found</h2>
            <p className="mt-2 text-gray-500">
              We couldn't find any products matching "{searchQuery}"
            </p>
            <div className="mt-6">
              <p className="text-gray-600 mb-4">Try these suggestions:</p>
              <ul className="space-y-2 text-gray-500">
                <li>• Check your spelling</li>
                <li>• Try different keywords</li>
                <li>• Browse our categories</li>
              </ul>
            </div>
            <button
              onClick={() => navigate('/')}
              className="mt-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaSearch className="mr-2" />
              Browse All Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults; 