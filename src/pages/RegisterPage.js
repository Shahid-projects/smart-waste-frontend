import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiX, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

// Define the URLs based on your deployed environment
const FRONTEND_URL = 'https://smart-waste-frontend.vercel.app';
const API_URL = 'https://smart-waste-backend.vercel.app/api/auth';

// --- Reusable Notification Component ---
const Notification = ({ message, type, onClose }) => {
    if (!message) return null;

    const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
    const Icon = type === 'success' ? FiCheckCircle : FiAlertTriangle;

    return (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg text-white shadow-xl flex items-center ${bgColor} transition-transform duration-300 ease-out`}
             style={{ transform: 'translateX(0%)' }} // Simple visibility control
        >
            <Icon className="h-5 w-5 mr-2" />
            <span>{message}</span>
            <button onClick={onClose} className="ml-4 p-1 rounded-full hover:bg-white/20">
                <FiX className="h-4 w-4" />
            </button>
        </div>
    );
};

// --- Register Form Component ---

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    const { fullName, email, password, confirmPassword } = formData;

    const showNotification = useCallback((message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    }, []);

    // REAL-TIME VALIDATION LOGIC
    useEffect(() => {
        const validate = () => {
            const newErrors = {};
            if (fullName && fullName.length < 3) newErrors.fullName = 'Full name must be at least 3 characters.';
            if (email && !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email address is invalid.';
            if (password && password.length < 8) newErrors.password = 'Must be at least 8 characters.';
            if (password && !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/.test(password)) {
                newErrors.password = 'Must include uppercase, lowercase, number, and special character.';
            }
            if (confirmPassword && password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
            
            setErrors(newErrors);
        };
        validate();
    }, [fullName, email, password, confirmPassword]);

    const onChange = e => setFormData({ ...formData, [e.target.id]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setNotification({ message: '', type: '' }); // Clear previous notification

        const finalErrors = {};
        // Required field checks for submission
        if (!fullName) finalErrors.fullName = 'Full name is required.';
        if (!email) finalErrors.email = 'Email is required.';
        if (!password) finalErrors.password = 'Password is required.';
        if (!confirmPassword) finalErrors.confirmPassword = 'Confirmation is required.';

        // Combine with real-time errors
        const validationFailed = Object.keys({ ...errors, ...finalErrors }).length > 0;

        if (validationFailed) {
            setErrors(prev => ({ ...prev, ...finalErrors }));
            showNotification('Please fill in all required fields and fix validation errors.', 'error');
            setIsLoading(false);
            return;
        }

        const newUser = { fullName, email, password };

        try {
            // Using the deployed URL
            await axios.post(`${API_URL}/register`, newUser);
            
            showNotification('Registration successful! Please log in.', 'success');
            
            // Clear form and navigate after a delay
            setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
            setTimeout(() => window.location.href = `${FRONTEND_URL}/login`, 1000); // Using window.location for full page navigation

        } catch (err) {
            const errorMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'A network or server error occurred.';
            showNotification(errorMsg, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const InputGroup = ({ label, id, type, icon: Icon, value, error }) => (
        <div className="form-group">
            <label htmlFor={id} className="form-label">{label}</label>
            <div className="input-wrapper">
                <Icon className="input-icon" />
                <input 
                    type={type} 
                    id={id} 
                    className={`form-input ${error ? 'input-error' : ''}`} 
                    placeholder={`Enter your ${label.toLowerCase()}`} 
                    value={value} 
                    onChange={onChange} 
                    required 
                    disabled={isLoading}
                />
            </div>
            {error && <p className="error-text">{error}</p>}
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Notification {...notification} onClose={() => setNotification({ message: '', type: '' })} />
            
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
                <div className="register-header text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Join EcoSort</h1>
                    <p className="text-gray-500 mt-1">Create your account to track your environmental impact</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputGroup label="Full Name" id="fullName" type="text" icon={FiUser} value={fullName} error={errors.fullName} />
                    <InputGroup label="Email Address" id="email" type="email" icon={FiMail} value={email} error={errors.email} />

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <div className="input-wrapper">
                            <FiLock className="input-icon" />
                            <input 
                                type={showPassword ? 'text' : 'password'} 
                                id="password" 
                                className={`form-input ${errors.password ? 'input-error' : ''}`} 
                                placeholder="Create a password" 
                                value={password} 
                                onChange={onChange} 
                                required 
                                disabled={isLoading}
                            />
                            <div className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </div>
                        </div>
                        {errors.password && <p className="error-text text-sm mt-1">{errors.password}</p>}
                    </div>

                    <InputGroup label="Confirm Password" id="confirmPassword" type="password" icon={FiLock} value={confirmPassword} error={errors.confirmPassword} />
                    
                    <button type="submit" className="w-full py-3 mt-6 text-white font-semibold rounded-lg bg-green-600 hover:bg-green-700 transition duration-200 disabled:bg-green-400" disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="signin-link text-center text-gray-500 mt-4">
                    Already have an account? <a href={`${FRONTEND_URL}/login`} className="text-green-600 hover:underline">Sign in here</a>
                </p>
            </div>
            
            {/* Embedded CSS for styling the components */}
            <style jsx="true">{`
                .form-group {
                    margin-bottom: 1rem;
                }
                .form-label {
                    display: block;
                    font-weight: 500;
                    color: #4b5563; /* Gray-600 */
                    margin-bottom: 0.25rem;
                }
                .input-wrapper {
                    position: relative;
                }
                .input-icon {
                    position: absolute;
                    left: 0.75rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #9ca3af; /* Gray-400 */
                    pointer-events: none;
                    width: 1.25rem;
                    height: 1.25rem;
                }
                .form-input {
                    width: 100%;
                    padding: 0.75rem 1rem 0.75rem 2.5rem; /* Padded left for icon */
                    border: 1px solid #d1d5db; /* Gray-300 */
                    border-radius: 0.5rem;
                    outline: none;
                    transition: all 0.2s;
                    color: #1f2937; /* Gray-800 */
                }
                .form-input:focus {
                    border-color: #10b981; /* Green-500 */
                    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
                }
                .input-error {
                    border-color: #ef4444; /* Red-500 */
                }
                .error-text {
                    color: #ef4444; /* Red-500 */
                    font-size: 0.75rem;
                    margin-top: 0.25rem;
                }
                .password-toggle-icon {
                    position: absolute;
                    right: 0.75rem;
                    top: 50%;
                    transform: translateY(-50%);
                    cursor: pointer;
                    color: #6b7280; /* Gray-500 */
                }
            `}</style>
        </div>
    );
};

export default RegisterPage;