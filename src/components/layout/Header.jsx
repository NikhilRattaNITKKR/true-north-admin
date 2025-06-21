import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import './Header.css';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  // const { theme, toggleTheme } = useTheme();

  return (
    <header className={`header `}>
      <div className="header-container">
        <Link to="/" className="logo">
          TrueNorth Admin
        </Link>
        
        <nav className="nav-menu">
          <Link to="/">Home</Link>
          {isAuthenticated ? (
            <>
              <Link to="/courses">Courses</Link>
              <Link to="/articles">Articles</Link>
              {/* <Link to="/webinars">Webinars</Link> */}
              <Link to="/workshops">Workshop</Link>
              <Link to="/research-papers">Research</Link>
              <Link to="/ebooks">Ebook</Link>
              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="login-btn">
              Login
            </Link>
          )}
          {/* <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'light' ? '🌙' : '☀️'}
          </button> */}
        </nav>
      </div>
    </header>
  );
};

export default Header; 