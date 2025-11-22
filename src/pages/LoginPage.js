import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
// We import our custom 'useAuth' hook to access the context
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  // Get the powerful 'login' function from our central AuthContext
  const { login } = useAuth(); 
  
  // State for the form fields
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { email, password } = formData;

  // This function updates state as the user types in an input field
  const onChange = e => setFormData({ ...formData, [e.target.id]: e.target.value });

  // This is the single, correct function to handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the browser from reloading the page
    try {
        // Call the login function from our context. It will handle the API call,
        // save the token, and update the application state for us.
        await login(email, password);
        
        alert('Login successful! Redirecting...');
        navigate('/'); // Redirect to the home page on success
    } catch (err) {
        // If the login function throws an error (e.g., invalid credentials), we catch it here.
        console.error(err); // It's good practice to log the full error for debugging
        alert(err.message || 'An error occurred during login. Please check your credentials.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your EcoSort account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {/* Form inputs are controlled by our state */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input type="email" id="email" className="form-input" placeholder="your@email.com" value={email} onChange={onChange} required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input type={showPassword ? 'text' : 'password'} id="password" className="form-input" placeholder="Enter your password" value={password} onChange={onChange} required />
              <div className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </div>
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary submit-btn">
            Sign In
          </button>
        </form>

        <p className="signup-link">
          Don't have an account? <Link to="/register">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

