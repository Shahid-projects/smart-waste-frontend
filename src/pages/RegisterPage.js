import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
// FIX: Using Lucide React icons, which are available in the environment.
import { User, Mail, Lock, Eye, EyeOff, X, CheckCircle, AlertTriangle } from 'lucide-react';
// Import the external CSS file (assuming it's named RegisterPage.css and is correctly linked in your project)
import './RegisterPage.css';

// Define the URLs based on your deployed environment
const FRONTEND_URL = 'https://smart-waste-frontend.vercel.app';
const API_URL = 'https://smart-waste-backend.vercel.app/api/auth';

// --- Reusable Notification Component ---
const Notification = ({ message, type, onClose }) => {
    if (!message) return null;

    // Use Tailwind classes only for non-structural elements like fixed positioning, colors, and shadows
    const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
    const Icon = type === 'success' ? CheckCircle : AlertTriangle;

    return (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg text-white shadow-xl flex items-center ${bgColor} transition-transform duration-300 ease-out`}
             style={{ transform: 'translateX(0%)' }} // Simple visibility control
        >
            <Icon className="h-5 w-5 mr-2" />
            <span>{message}</span>
            <button onClick={onClose} className="ml-4 p-1 rounded-full hover:bg-white/20">
                <X className="h-4 w-4" />
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

    // Helper functions for final submission check 
    const validateUsername = (name) => {
        if (name.length < 3) return 'Full name must be at least 3 characters.';
        return null;
    };
    const validateEmail = (email) => {
        if (!/\S+@\S+\.\S+/.test(email)) return 'Email address is invalid.';
        return null;
    };
    const validatePassword = (pw) => {
        if (pw.length < 8) return 'Password must be at least 8 characters.';
        if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/.test(pw)) {
            return 'Password must contain an uppercase, lowercase, number, and special character.';
        }
        return null;
    };

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

        // --- FINAL PRE-SUBMISSION VALIDATION ---
        const submissionErrors = {
            ...errors, 
            ...finalErrors
        };
        
        // Re-run validation just before submission using current state values
        if (validateUsername(fullName)) submissionErrors.fullName = validateUsername(fullName);
        if (validateEmail(email)) submissionErrors.email = validateEmail(email);
        if (validatePassword(password)) submissionErrors.password = validatePassword(password);
        if (password !== confirmPassword) submissionErrors.confirmPassword = 'Passwords do not match.';

        const validationFailed = Object.values(submissionErrors).some(error => error !== null && error !== undefined);


        if (validationFailed) {
            setErrors(submissionErrors);
            showNotification('Please fill in all required fields and fix validation errors.', 'error');
            setIsLoading(false);
            return;
        }
        // --- END FINAL PRE-SUBMISSION VALIDATION ---


        const newUser = { fullName, email, password };

        try {
            // Using the deployed URL
            await axios.post(`${API_URL}/register`, newUser);
            
            showNotification('Registration successful! Please log in.', 'success');
            
            // Clear form and navigate after a delay
            setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
            setTimeout(() => window.location.href = `${FRONTEND_URL}/login`, 1000); 

        } catch (err) {
            const errorMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'A network or server error occurred.';
            showNotification(errorMsg, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Component helper using CSS classes
    const InputGroup = ({ label, id, type, icon: Icon, value, error }) => (
        <div className="form-group">
            <label htmlFor={id} className="form-label">{label}</label>
            <div className="input-wrapper">
                <Icon className="input-icon" />
                <input 
                    type={type} 
                    id={id} 
                    // Use CSS classes for styling and error indication
                    className={`form-input ${error ? 'input-error' : ''}`} 
                    placeholder={`Enter your ${label.toLowerCase()}`} 
                    value={value} 
                    onChange={onChange} 
                    required 
                    disabled={isLoading}
                />
            </div>
            {/* Use CSS class for error text styling */}
            {error && <p className="error-text">{error}</p>}
        </div>
    );

    return (
        // Use the main CSS class defined in RegisterPage.css
        <div className="register-page min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Notification {...notification} onClose={() => setNotification({ message: '', type: '' })} />
            
            {/* Use the main container CSS class */}
            <div className="register-container w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
                <div className="register-header text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Join EcoSort</h1>
                    <p className="text-gray-500 mt-1">Create your account to track your environmental impact</p>
                </div>

                <form onSubmit={handleSubmit} className="register-form space-y-4">
                    {/* Using Lucide Icons: User, Mail, Lock */}
                    <InputGroup label="Full Name" id="fullName" type="text" icon={User} value={fullName} error={errors.fullName} />
                    <InputGroup label="Email Address" id="email" type="email" icon={Mail} value={email} error={errors.email} />

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" />
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
                            {/* The password toggle icon is interactive */}
                            <div className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff /> : <Eye />}
                            </div>
                        </div>
                        {errors.password && <p className="error-text">{errors.password}</p>}
                    </div>

                    <InputGroup label="Confirm Password" id="confirmPassword" type="password" icon={Lock} value={confirmPassword} error={errors.confirmPassword} />
                    
                    {/* Use the CSS button class */}
                    <button type="submit" className="btn btn-primary submit-btn" disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="signin-link">
                    Already have an account? <a href={`${FRONTEND_URL}/login`}>Sign in here</a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;