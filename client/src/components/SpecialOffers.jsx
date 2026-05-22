import React from 'react';

const offers = [
  {
    id: 1,
    title: 'Summer Special',
    description: 'Get 20% off on all skincare products',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    discount: '20% OFF',
  },
  {
    id: 2,
    title: 'New Arrivals',
    description: 'Buy 2 Get 1 Free on selected items',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    discount: 'BUY 2 GET 1',
  },
  {
    id: 3,
    title: 'Weekend Sale',
    description: 'Flat 15% off on all medicines',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    discount: '15% OFF',
  },
];

const SpecialOffers = () => {
  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Special Offers</h2>
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {offers.map((offer) => (
            <div key={offer.id} className="group relative">
              <div className="relative w-full h-80 bg-white rounded-lg overflow-hidden group-hover:opacity-75">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-center object-cover"
                />
                <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 rounded-bl-lg">
                  {offer.discount}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <h3 className="text-lg font-medium text-white">{offer.title}</h3>
                  <p className="mt-1 text-sm text-gray-200">{offer.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecialOffers; 