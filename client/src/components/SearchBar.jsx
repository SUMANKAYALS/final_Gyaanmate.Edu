import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useSearch } from '../context/SearchContext';

const SearchBar = () => {
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);
  const { searchQuery, searchCourses, courses } = useSearch();
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (localSearchQuery.trim()) {
      searchCourses(localSearchQuery);
      navigate(`/search?q=${encodeURIComponent(localSearchQuery)}`);
      setIsFocused(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    if (value.trim() === '') {
      searchCourses('');
    }
  };

  const handleSuggestionClick = (course) => {
    setLocalSearchQuery(course.title);
    searchCourses(course.title);
    navigate(`/course/${course.id}`);
    setIsFocused(false);
  };

  const clearSearch = () => {
    setLocalSearchQuery('');
    searchCourses('');
  };

  // Filter suggestions based on search query
  const suggestions = localSearchQuery.length > 2 
    ? courses.filter(course => 
        course.title.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(localSearchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <div className="relative" ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            type="text"
            value={localSearchQuery}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            placeholder="Search for courses..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </div>
          {localSearchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <FaTimes className="h-5 w-5 text-gray-400 hover:text-gray-500" />
            </button>
          )}
        </div>
      </form>

      {isFocused && localSearchQuery.length > 2 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg">
          {suggestions.length > 0 ? (
            <ul className="max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
              {suggestions.map((course) => (
                <li
                  key={course.id}
                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50"
                  onClick={() => handleSuggestionClick(course)}
                >
                  <div className="flex items-center">
                    <span className="font-normal block truncate">{course.title}</span>
                    <span className="ml-2 text-sm text-gray-500">{course.category}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">No courses found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;