import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getUserProfile, logout } from '../services/user';
import { toast } from 'react-hot-toast';

const Sidebar = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await getUserProfile();
      if (response.status >= 200 && response.status < 300) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-white text-gray-700 w-64 min-h-screen flex flex-col shadow-lg">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-[#507b00]">TrueNorth Admin</h1>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-200">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ) : user ? (
          <div>
            <p className="text-sm text-gray-500">Welcome,</p>
            <p className="font-medium text-gray-700">{user.email}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Not logged in</p>
        )}
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              className={`block px-4 py-2 rounded-lg transition-colors duration-200 ${
                isActive('/')
                  ? 'bg-[#507b00] text-white'
                  : 'text-gray-600 hover:bg-[#507b00] hover:text-white'
              }`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/courses"
              className={`block px-4 py-2 rounded-lg transition-colors duration-200 ${
                isActive('/courses')
                  ? 'bg-[#507b00] text-white'
                  : 'text-gray-600 hover:bg-[#507b00] hover:text-white'
              }`}
            >
              Courses
            </Link>
          </li>
          <li>
            <Link
              to="/articles"
              className={`block px-4 py-2 rounded-lg transition-colors duration-200 ${
                isActive('/articles')
                  ? 'bg-[#507b00] text-white'
                  : 'text-gray-600 hover:bg-[#507b00] hover:text-white'
              }`}
            >
              Articles
            </Link>
          </li>
          <li>
            <Link
              to="/workshops"
              className={`block px-4 py-2 rounded-lg transition-colors duration-200 ${
                isActive('/workshops')
                  ? 'bg-[#507b00] text-white'
                  : 'text-gray-600 hover:bg-[#507b00] hover:text-white'
              }`}
            >
              Workshops
            </Link>
          </li>
          <li>
            <Link
              to="/research-papers"
              className={`block px-4 py-2 rounded-lg transition-colors duration-200 ${
                isActive('/research-papers')
                  ? 'bg-[#507b00] text-white'
                  : 'text-gray-600 hover:bg-[#507b00] hover:text-white'
              }`}
            >
              Research Papers
            </Link>
          </li>
          <li>
            <Link
              to="/ebooks"
              className={`block px-4 py-2 rounded-lg transition-colors duration-200 ${
                isActive('/ebooks')
                  ? 'bg-[#507b00] text-white'
                  : 'text-gray-600 hover:bg-[#507b00] hover:text-white'
              }`}
            >
              Ebooks
            </Link>
          </li>
           {/* <li>
            <Link
              to="/quiz-categories"
              className={`block px-4 py-2 rounded-lg transition-colors duration-200 ${
                isActive('/quiz-categories')
                  ? 'bg-[#507b00] text-white'
                  : 'text-gray-600 hover:bg-[#507b00] hover:text-white'
              }`}
            >
              Quiz Categories
            </Link>
          </li> */}
          <li>
            <Link
              to="/quiz"
              className={`block px-4 py-2 rounded-lg transition-colors duration-200 ${
                isActive('/quiz')
                  ? 'bg-[#507b00] text-white'
                  : 'text-gray-600 hover:bg-[#507b00] hover:text-white'
              }`}
            >
              Quizzes
            </Link>
          </li>
          <li>
            <Link
              to="/case-studies"
              className={`block px-4 py-2 rounded-lg transition-colors duration-200 ${
                isActive('/case-studies')
                  ? 'bg-[#507b00] text-white'
                  : 'text-gray-600 hover:bg-[#507b00] hover:text-white'
              }`}
            >
              Case Studies
            </Link>
          </li>
          <li>
            <Link
              to="/newsletters"
              className={`block px-4 py-2 rounded-lg transition-colors duration-200 ${
                isActive('/newsletters')
                  ? 'bg-[#507b00] text-white'
                  : 'text-gray-600 hover:bg-[#507b00] hover:text-white'
              }`}
            >
              Newsletters
            </Link>
          </li>
          <li>
            <Link
              to="/sales"
              className={`block px-4 py-2 rounded-lg transition-colors duration-200 ${
                isActive('/sales')
                  ? 'bg-[#507b00] text-white'
                  : 'text-gray-600 hover:bg-[#507b00] hover:text-white'
              }`}
            >
              Sales
            </Link>
          </li>
          <li>
            <Link
              to="/slider"
              className={`block px-4 py-2 rounded-lg transition-colors duration-200 ${
                isActive('/slider')
                  ? 'bg-[#507b00] text-white'
                  : 'text-gray-600 hover:bg-[#507b00] hover:text-white'
              }`}
            >
              Slider
            </Link>
          </li>
           <li>
            <Link
              to="/feedback"
              className={`block px-4 py-2 rounded-lg transition-colors duration-200 ${
                isActive('/feedback')
                  ? 'bg-[#507b00] text-white'
                  : 'text-gray-600 hover:bg-[#507b00] hover:text-white'
              }`}
            >
              Feedback
            </Link>
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-left text-gray-600 hover:bg-[#507b00] hover:text-white rounded-lg flex items-center transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 