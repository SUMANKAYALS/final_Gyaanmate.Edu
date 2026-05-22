import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import { useEnrollment } from '../context/EnrollmentContext';
import CourseCard from '../components/CourseCard';

const CourseCategoryPage = () => {
  const { category } = useParams();
  const { courses } = useSearch();
  const { addToCart, isEnrolled } = useEnrollment();

  const categoryName = category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const filteredCourses = useMemo(() => {
    return courses.filter(course => 
      course.category.toLowerCase() === categoryName.toLowerCase()
    );
  }, [courses, categoryName]);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {categoryName} Courses
          </h1>
          <p className="text-gray-600">
            {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-6">
              No courses found in this category.
            </p>
            <a 
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Back to Home
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                onEnroll={addToCart}
                isEnrolled={isEnrolled(course.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCategoryPage;
