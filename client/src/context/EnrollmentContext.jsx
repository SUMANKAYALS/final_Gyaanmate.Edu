import React, { createContext, useContext, useState, useCallback } from 'react';
import Notification from '../components/Notification';

const EnrollmentContext = createContext();

export const useEnrollment = () => {
  const context = useContext(EnrollmentContext);
  if (!context) {
    throw new Error('useEnrollment must be used within an EnrollmentProvider');
  }
  return context;
};

export const EnrollmentProvider = ({ children }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [enrollmentCart, setEnrollmentCart] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [progress, setProgress] = useState({});

  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 3000);
  };

  // Add course to enrollment cart (like adding to shopping cart)
  const addToCart = useCallback((course) => {
    const courseId = course?._id || course?.id;
    if (!course || !courseId) {
      console.error('Invalid course data:', course);
      return;
    }

    setEnrollmentCart(prevItems => {
      const existingItem = prevItems.find(item => (item._id || item.id) === courseId);
      if (!existingItem) {
        return [...prevItems, { ...course, addedAt: new Date() }];
      }
      return prevItems;
    });
    
    showNotification(`${course.title} added to cart!`);
  }, []);

  // Remove course from enrollment cart
  const removeFromCart = useCallback((courseId) => {
    setEnrollmentCart(prevItems => prevItems.filter(item => (item._id || item.id) !== courseId));
  }, []);

  const clearCart = useCallback(() => {
    setEnrollmentCart([]);
  }, []);

  // Enroll in a course (complete purchase)
  const enrollCourse = useCallback((course) => {
    if (!course || !course.id) {
      console.error('Invalid course data:', course);
      return;
    }

    setEnrolledCourses(prevItems => {
      const existingEnrollment = prevItems.find(item => item.id === course.id);
      if (!existingEnrollment) {
        // Initialize progress for this course
        setProgress(prev => ({
          ...prev,
          [course.id]: {
            completedLessons: [],
            currentLesson: course.lessons[0]?.id || null,
            progressPercentage: 0,
            enrolledDate: new Date()
          }
        }));
        return [...prevItems, { ...course, enrolledAt: new Date() }];
      }
      return prevItems;
    });

    // Remove from cart after enrollment
    removeFromCart(course.id);
    showNotification(`You've been enrolled in ${course.title}!`);
  }, [removeFromCart]);

  // Enroll in multiple courses from cart
  const checkoutEnrollment = useCallback(() => {
    const coursesToEnroll = [...enrollmentCart];
    coursesToEnroll.forEach(course => {
      enrollCourse(course);
    });
    setEnrollmentCart([]);
  }, [enrollmentCart, enrollCourse]);

  // Mark lesson as completed
  const completeLesson = useCallback((courseId, lessonId) => {
    setProgress(prev => {
      const courseProgress = prev[courseId] || {};
      const completedLessons = courseProgress.completedLessons || [];
      
      if (!completedLessons.includes(lessonId)) {
        const updatedCompleted = [...completedLessons, lessonId];
        const course = enrolledCourses.find(c => c.id === courseId);
        const totalLessons = course?.lessons?.length || 1;
        const progressPercentage = (updatedCompleted.length / totalLessons) * 100;

        return {
          ...prev,
          [courseId]: {
            ...courseProgress,
            completedLessons: updatedCompleted,
            progressPercentage
          }
        };
      }
      return prev;
    });
  }, [enrolledCourses]);

  // Update current lesson
  const updateCurrentLesson = useCallback((courseId, lessonId) => {
    setProgress(prev => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        currentLesson: lessonId
      }
    }));
  }, []);

  // Get course by ID
  const getCourseById = useCallback((courseId) => {
    return enrolledCourses.find(course => course.id === courseId);
  }, [enrolledCourses]);

  // Check if course is enrolled
  const isEnrolled = useCallback((courseId) => {
    return enrolledCourses.some(course => (course._id || course.id) === courseId);
  }, [enrolledCourses]);

  // Get cart total
  const getCartTotal = useCallback(() => {
    return enrollmentCart.reduce((total, course) => total + course.price, 0);
  }, [enrollmentCart]);

  return (
    <EnrollmentContext.Provider value={{
      enrolledCourses,
      enrollmentCart,
      notification,
      progress,
      addToCart,
      removeFromCart,
      clearCart,
      enrollCourse,
      checkoutEnrollment,
      completeLesson,
      updateCurrentLesson,
      getCourseById,
      isEnrolled,
      getCartTotal,
      cartItems: enrollmentCart,
      cartItemCount: enrollmentCart.length,
      showNotification
    }}>
      <Notification 
        message={notification.message} 
        isVisible={notification.show}
      />
      {children}
    </EnrollmentContext.Provider>
  );
};
