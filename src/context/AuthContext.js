import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// 1. Create the context which will be available to all components
const AuthContext = createContext(null);

// 2. Create a simple, reusable hook to easily access the context's values
export const useAuth = () => {
    return useContext(AuthContext);
};

// 3. Create the Provider component. This component will wrap your entire app
//    and manage all the authentication logic.
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Holds the logged-in user's data (e.g., name, email)
    const [token, setToken] = useState(localStorage.getItem('token')); // Holds the JWT token
    const [loading, setLoading] = useState(true); // Tracks if we are still trying to load the initial user
    const [toast, setToast] = useState(null); // State for our toast notifications

    // Helper function to show a toast message for a few seconds
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        // Automatically hide the toast after a short delay
        setTimeout(() => {
            setToast(null);
        }, 3200); // A little longer than the CSS animation
    };

    // This effect runs when the app first loads or when the token changes.
    // Its job is to automatically log the user in if a valid token is found.
    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                // If a token exists, set it as a default header for all future axios requests
                axios.defaults.headers.common['x-auth-token'] = token;
                try {
                    // Make a request to the backend to get the user's data
                    const res = await axios.get('https://smart-waste-backend.vercel.app/api/auth');
                    setUser(res.data); // Store the user data in our state
                } catch (err) {
                    console.error('Could not load user, token might be invalid.', err);
                    logout(false); // Log the user out silently if the token is bad
                }
            }
            setLoading(false); // We're done loading
        };
        loadUser();
    }, [token]);

    // Function to handle user login
    const login = async (email, password) => {
        const config = { headers: { 'Content-Type': 'application/json' } };
        const body = JSON.stringify({ email, password });
        try {
            const res = await axios.post('https://smart-waste-backend.vercel.app/api/auth/login', body, config);
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token); // This will trigger the useEffect above to load the user
            return res.data;
        } catch (err) {
            // Throw the error so the LoginPage component can catch it and show an alert
            throw new Error(err.response?.data?.msg || 'Login failed');
        }
    };

    // The new, improved logout function with delayed notifications
    const logout = (showMessage = true) => {
        // This 'if' block is for silent logouts (e.g., if a token expires)
        if (!showMessage) {
            localStorage.removeItem('token');
            setUser(null);
            setToken(null);
            delete axios.defaults.headers.common['x-auth-token'];
            return;
        }

        // 1. Show the blue "Processing" message first
        showToast('Processing logout...', 'info');

        // 2. Wait for 2 seconds to give the user feedback
        setTimeout(() => {
            // 3. Perform the actual logout actions
            localStorage.removeItem('token');
            setUser(null);
            setToken(null);
            delete axios.defaults.headers.common['x-auth-token'];

            // 4. Show the final green success message
            showToast('You have been successfully logged out.', 'success');
        }, 2000); // 2-second delay
    };

    // This is the value that will be provided to all components wrapped by this provider
    const value = {
        user,
        token,
        isAuthenticated: !!user, // A simple boolean to check if a user is logged in
        loading,
        login,
        logout,
        toast // The toast state so our App.js can display it
    };

    return (
        <AuthContext.Provider value={value}>
            {/* We don't render the children (the rest of the app) until the initial user loading is complete */}
            {!loading && children}
        </AuthContext.Provider>
    );
};

