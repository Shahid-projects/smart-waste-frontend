import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaRecycle, FaUpload, FaSignInAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; // <-- IMPORT
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth(); // <-- Get auth state

  const authLinks = (
    <>
      <div className="navbar-welcome">
        Welcome, {user ? user.fullName.split(' ')[0] : ''}!
      </div>
      <button onClick={logout} className="auth-link logout-btn">
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
    </>
  );

  const guestLinks = (
    <div className="user-auth">
      <NavLink to="/login" className="auth-link">
        <FaSignInAlt />
        <span>Login</span>
      </NavLink>
      <span className="auth-separator">|</span>
      <NavLink to="/register" className="auth-link">
        <FaUserPlus />
        <span>Register</span>
      </NavLink>
    </div>
  );

  return (
    <header className="header">
      <nav className="navbar container">
        <Link to="/" className="navbar-logo">
          <FaRecycle className="logo-icon" />
          EcoSort
        </Link>

        <div className="navbar-actions">
          <NavLink to="/classify" className="btn btn-primary">
            <FaUpload />
            <span>Classify Waste</span>
          </NavLink>
          {isAuthenticated ? authLinks : guestLinks} {/* <-- CONDITIONAL RENDER */}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
