import React from 'react';
import { courses } from '../data/courses';
import { useEnrollment } from '../context/EnrollmentContext';
import CourseCard from './CourseCard';

const FeaturedCourses = () => {
  const { addToCart, isEnrolled } = useEnrollment();
  
  // Get top rated courses
  const featuredCourses = courses.sort((a, b) => b.rating - a.rating).slice(0, 6);

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Courses
          </h2>
          <p className="text-lg text-gray-600">
            Explore our most popular and highly-rated courses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onEnroll={addToCart}
              isEnrolled={isEnrolled(course.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCourses;
