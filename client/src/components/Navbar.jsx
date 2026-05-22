import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaChevronDown, FaBars, FaTimes, FaBook } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useEnrollment } from '../context/EnrollmentContext';

const Navbar = ({ onCartClick }) => {
  const { isAuthenticated, logout, user } = useAuth();
  const { enrollmentCart } = useEnrollment();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  const navigationLinks = [
    { to: "/category/nursing", text: "Nursing" },
    { to: "/category/pharmacology", text: "Pharmacology" },
    { to: "/category/medical-devices", text: "Medical Devices" },
    { to: "/category/emergency-care", text: "Emergency Care" },
    { to: "/category/maternal-health", text: "Maternal Health" },
    { to: "/category/wellness", text: "Wellness" },
  ];

  return (
    <nav className="bg-white shadow-md relative">
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and hamburger menu */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center text-2xl font-bold text-blue-600">
                <FaBook className="h-8 w-8 mr-2" />
                <span className="hidden sm:block">EDULEARN</span>
              </Link>
            </div>
            
            {/* Hamburger menu button */}
            <button
              onClick={toggleMobileMenu}
              className="ml-4 md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 z-50"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center">
            <div className="flex items-baseline space-x-4">
              {navigationLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap"
                >
                  {link.text}
                </Link>
              ))}
              {isAuthenticated && (
                <Link 
                  to="/my-courses"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap flex items-center gap-1"
                >
                  <FaBook className="h-4 w-4" />
                  My Learning
                </Link>
              )}
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <button 
              onClick={onCartClick}
              className="text-gray-700 hover:text-blue-600 cursor-pointer relative"
              title="Enrollment Cart"
            >
              <FaShoppingCart className="h-6 w-6" />
              {enrollmentCart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {enrollmentCart.length}
                </span>
              )}
            </button>

            {/* Profile Menu */}
            <div className="relative profile-dropdown">
              <button
                onClick={toggleProfile}
                className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
              >
                <FaUser className="h-6 w-6 sm:mr-2" />
                <span className="hidden sm:inline">
                  {isAuthenticated ? (
                    <span className="text-sm font-medium mr-2 max-w-[150px] truncate">
                      {user?.email}
                    </span>
                  ) : (
                    <span className="text-sm font-medium mr-2">Account</span>
                  )}
                </span>
                <FaChevronDown 
                  className={`hidden sm:block h-4 w-4 transform transition-transform duration-200 ${
                    isProfileOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm text-gray-500">Signed in as</p>
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/my-courses"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FaBook className="h-4 w-4 mr-2" />
                        My Courses
                      </Link>
                      <Link
                        to="/account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 items-center"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FaUser className="h-4 w-4 mr-2" />
                        My Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 items-center"
                      >
                        <FaSignOutAlt className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">Welcome to EDULEARN</p>
                        <p className="text-xs text-gray-500">Sign in to access your courses</p>
                      </div>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Sign In
                      </Link>
                      <div className="px-4 py-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500">Don't have an account?</p>
                        <Link
                          to="/signup"
                          className="block mt-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Create an Account
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div 
        className={`fixed top-0 left-0 h-full w-80 bg-white transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <Link to="/" className="flex items-center text-2xl font-bold text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>
            <FaBook className="h-8 w-8 mr-2" />
            <span>EDULEARN</span>
          </Link>
          <button
            onClick={toggleMobileMenu}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.text}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                to="/my-courses"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaBook className="h-4 w-4" />
                My Learning
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 