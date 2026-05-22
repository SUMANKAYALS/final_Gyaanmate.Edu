import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaRegStar, FaUsers } from 'react-icons/fa';
import { GoClock } from 'react-icons/go';

const CourseCard = ({ course, onEnroll, isEnrolled }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-sm" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-sm" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300 text-sm" />);
      }
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <Link to={`/course/${course.id}`} className="block">
        <div className="relative">
          <img 
            src={course.image} 
            alt={course.title} 
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {course.category}
          </div>
        </div>
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        {/* Instructor */}
        <div className="flex items-center mb-3">
          <img 
            src={course.instructor.image} 
            alt={course.instructor.name}
            className="w-8 h-8 rounded-full mr-2"
          />
          <p className="text-sm text-gray-600">{course.instructor.name}</p>
        </div>

        {/* Title */}
        <Link to={`/course/${course.id}`} className="block">
          <h3 className="text-lg font-semibold mb-2 hover:text-blue-600 line-clamp-2">
            {course.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">{course.description}</p>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex mr-2">
            {renderStars(course.rating)}
          </div>
          <span className="text-sm text-gray-600">
            {course.rating.toFixed(1)} ({course.reviews} reviews)
          </span>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mb-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <FaUsers className="text-blue-600" />
            {course.students.toLocaleString()} students
          </div>
          <div className="flex items-center gap-1">
            <GoClock className="text-blue-600" />
            {course.duration}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t">
          <span className="text-xl font-bold text-blue-600">
            ${course.price.toFixed(2)}
          </span>
          {isEnrolled ? (
            <Link 
              to={`/course/${course.id}/learn`}
              className="bg-green-600 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-green-700 transition"
            >
              Learn
            </Link>
          ) : (
            <button
              onClick={() => onEnroll(course)}
              className="bg-blue-600 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-blue-700 transition"
            >
              Enroll
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
