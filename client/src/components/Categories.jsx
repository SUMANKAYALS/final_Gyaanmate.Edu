import React from 'react';
import { Link } from 'react-router-dom';
import { FaBaby, FaUser, FaGlassWhiskey, FaHome, FaPills, FaStethoscope, FaGift } from 'react-icons/fa';

const categories = [
  {
    id: 'baby-mom',
    name: 'Baby & Mom Care',
    icon: <FaBaby className="h-8 w-8" />,
    link: '/category/baby-mom',
  },
  {
    id: 'personal-care',
    name: 'Personal Care',
    icon: <FaUser className="h-8 w-8" />,
    link: '/category/personal-care',
  },
  {
    id: 'beverages',
    name: 'Beverages',
    icon: <FaGlassWhiskey className="h-8 w-8" />,
    link: '/category/beverages',
  },
  {
    id: 'household-items',
    name: 'Household Items',
    icon: <FaHome className="h-8 w-8" />,
    link: '/category/household-items',
  },
  {
    id: 'treatments',
    name: 'Treatments',
    icon: <FaPills className="h-8 w-8" />,
    link: '/category/treatments',
  },
  {
    id: 'medical-devices',
    name: 'Medical Devices & Surgicals',
    icon: <FaStethoscope className="h-8 w-8" />,
    link: '/category/medical-devices',
  },
  {
    id: 'offers',
    name: 'Offers',
    icon: <FaGift className="h-8 w-8" />,
    link: '/category/offers',
  },
];

const Categories = () => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-7">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.link}
              className="group relative flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="text-blue-600 group-hover:text-blue-700 mb-4">
                {category.icon}
              </div>
              <h3 className="text-sm font-medium text-gray-900 text-center">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories; 