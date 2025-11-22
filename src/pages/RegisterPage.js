import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import './RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  // 1. STATE FOR ERRORS
  // We'll store validation error messages here.
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { fullName, email, password, confirmPassword } = formData;

  // 2. REAL-TIME VALIDATION LOGIC
  // This effect runs every time the user types into a field.
  useEffect(() => {
    const validate = () => {
      const newErrors = {};
      // Full Name validation
      if (fullName && fullName.length < 3) newErrors.fullName = 'Full name must be at least 3 characters';
      // Email validation (simple regex for format)
      if (email && !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email address is invalid';
      // Password validation
      if (password && password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      if (password && !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/.test(password)) {
        newErrors.password = 'Password must contain an uppercase, lowercase, number, and special character';
      }
      // Confirm Password validation
      if (confirmPassword && password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      
      setErrors(newErrors);
    };
    validate();
  }, [fullName, email, password, confirmPassword]);

  const onChange = e => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 3. FINAL CHECK BEFORE SUBMITTING
    // Check if there are any errors in our state.
    if (Object.keys(errors).length > 0 || !fullName || !email || !password || !confirmPassword) {
      alert('Please fix the errors before submitting.');
      return;
    }

    const newUser = { fullName, email, password };

    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const body = JSON.stringify(newUser);
      await axios.post('https://smart-waste-backend.vercel.app/api/auth/register', body, config);
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      // The backend might still find an error (like a duplicate email).
      alert(err.response?.data?.errors[0]?.msg || 'An error occurred.');
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>Join EcoSort</h1>
          <p>Create your account to track your environmental impact</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {/* 4. DISPLAYING THE ERRORS */}
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">Full Name</label>
            <div className="input-wrapper">
              <FiUser className="input-icon" />
              <input type="text" id="fullName" className={`form-input ${errors.fullName ? 'input-error' : ''}`} placeholder="Your full name" value={fullName} onChange={onChange} required />
            </div>
            {errors.fullName && <p className="error-text">{errors.fullName}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input type="email" id="email" className={`form-input ${errors.email ? 'input-error' : ''}`} placeholder="your@email.com" value={email} onChange={onChange} required />
            </div>
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input type={showPassword ? 'text' : 'password'} id="password" className={`form-input ${errors.password ? 'input-error' : ''}`} placeholder="Create a password" value={password} onChange={onChange} required />
              <div className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </div>
            </div>
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input type="password" id="confirmPassword" className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`} placeholder="Confirm your password" value={confirmPassword} onChange={onChange} required />
            </div>
            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
          </div>
          
          <button type="submit" className="btn btn-primary submit-btn">
            Create Account
          </button>
        </form>

        <p className="signin-link">
          Already have an account? <Link to="/login">Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;