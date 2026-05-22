import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaRegStar, FaUsers } from 'react-icons/fa';
import { GoClock } from 'react-icons/go';
import { GoClock as GoClockIcon } from 'react-icons/go';
import { useSearch } from '../context/SearchContext';
import { useEnrollment } from '../context/EnrollmentContext';
import { useAuth } from '../context/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCourseById } = useSearch();
  const { addToCart, isEnrolled, enrolledCourses } = useEnrollment();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const course = getCourseById(parseInt(id));
  const enrolled = isEnrolled(parseInt(id));

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Course not found</h2>
          <p className="mt-2 text-gray-600">The course you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  const handleEnroll = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCart(course);
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Course Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <span className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                {course.category}
              </span>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                {course.description}
              </p>
            </div>

            {/* Instructor Info */}
            <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
              <img 
                src={course.instructor.image} 
                alt={course.instructor.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {course.instructor.name}
                </h3>
                <p className="text-gray-600">{course.instructor.bio}</p>
              </div>
            </div>

            {/* Rating and Stats */}
            <div className="flex gap-6 mb-8 pb-8 border-b">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {renderStars(course.rating)}
                </div>
                <span className="text-gray-700">
                  {course.rating.toFixed(1)} ({course.reviews} reviews)
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <FaUsers />
                {course.students.toLocaleString()} students
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <GoClockIcon />
                {course.duration}
              </div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded font-semibold">
                {course.level}
              </div>
            </div>
          </div>

          {/* Right Column - Price and Enroll Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-20">
              <img 
                src={course.image} 
                alt={course.title}
                className="w-full h-40 object-cover rounded-lg mb-6"
              />
              
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  ${course.price.toFixed(2)}
                </div>
                <p className="text-gray-600">One-time payment</p>
              </div>

              {enrolled ? (
                <div className="text-center">
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg mb-4 font-semibold">
                    ✓ Enrolled
                  </div>
                  <a 
                    href={`/course/${course.id}/learn`}
                    className="block w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition text-center"
                  >
                    Continue Learning
                  </a>
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-3"
                >
                  Enroll Now
                </button>
              )}

              <div className="mt-6 space-y-3 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📚</span>
                  <span>{course.lessons.length} lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">⏱️</span>
                  <span>{course.duration} duration</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">📜</span>
                  <span>Certificate included</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">♾️</span>
                  <span>Lifetime access</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="border-b mb-8">
          <div className="flex gap-8">
            {['overview', 'lessons', 'skills', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 font-semibold border-b-2 transition ${
                  activeTab === tab
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && (
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this course</h2>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                {course.description_full}
              </p>
            </div>
          )}

          {activeTab === 'lessons' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Lessons</h2>
              <div className="space-y-3">
                {course.lessons.map((lesson, index) => (
                  <div key={lesson.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {index + 1}. {lesson.title}
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">{lesson.duration}</p>
                    </div>
                    {enrolled ? (
                      <span className="text-blue-600 font-semibold">📹 Available</span>
                    ) : (
                      <span className="text-gray-500">🔒 Locked</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills you'll learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.skills.map((skill, index) => (
                  <div key={index} className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">✓</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{skill}</h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
              <div className="text-center py-12">
                <div className="text-5xl mb-4">⭐</div>
                <p className="text-gray-600 text-lg">
                  {course.rating.toFixed(1)} average rating based on {course.reviews} reviews
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
