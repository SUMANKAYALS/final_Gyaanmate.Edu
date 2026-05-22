import React from 'react';
import { Link } from 'react-router-dom';
import { courseCategories } from '../data/courses';

const CourseCategories = () => {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Course Categories
          </h2>
          <p className="text-lg text-gray-600">
            Explore courses by category
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {courseCategories.map((category) => (
            <Link
              key={category.name}
              to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105 text-center"
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-sm text-gray-600">{category.count} courses</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseCategories;
