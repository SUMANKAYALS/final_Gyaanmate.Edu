import React, { createContext, useContext, useState, useCallback } from 'react';
import { courses } from '../data/courses';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchCourses = useCallback((query) => {
    setIsLoading(true);
    setSearchQuery(query);
    
    // Simulate API delay
    setTimeout(() => {
      if (query.trim() === '') {
        setSearchResults(courses); // Show all courses when search is empty
      } else {
        const filtered = courses.filter(course =>
          course.title.toLowerCase().includes(query.toLowerCase()) ||
          course.description.toLowerCase().includes(query.toLowerCase()) ||
          course.category.toLowerCase().includes(query.toLowerCase()) ||
          course.skills?.some(skill => 
            skill.toLowerCase().includes(query.toLowerCase())
          )
        );
        setSearchResults(filtered);
      }
      setIsLoading(false);
    }, 500);
  }, []);

  // Initialize with all courses
  React.useEffect(() => {
    setSearchResults(courses);
  }, []);

  return (
    <SearchContext.Provider value={{
      searchQuery,
      searchResults,
      isLoading,
      searchCourses,
      courses, // Expose the full courses array
      getCourseById: (id) => courses.find(course => course.id === id),
      // Keep backward compatibility
      searchProducts: searchCourses,
      products: courses,
      getProductById: (id) => courses.find(course => course.id === id)
    }}>
      {children}
    </SearchContext.Provider>
  );
}; 