import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// We need 'useAuth' here to access the toast state from the context
import { AuthProvider, useAuth } from './context/AuthContext'; 
import Toast from './components/Toast';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ClassificationPage from './pages/ClassificationPage';
import ThankYouPage from './pages/ThankYouPage';

import './App.css';

// This is the new helper component. It's purpose is to sit inside AuthProvider
// so it can use the useAuth() hook to get the toast state.
const AppContent = () => {
    const { toast } = useAuth(); // Get the toast state from our context

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/classify" element={<ClassificationPage />} />
                <Route path="/thank-you" element={<ThankYouPage />} />
            </Routes>
            
            {/* This line will render the Toast component whenever the toast state is not null */}
            {toast && <Toast message={toast.message} type={toast.type} />}
        </>
    );
};


// The main App component you provided, but updated to use AppContent
function App() {
  return (
    <AuthProvider> {/* The provider wraps everything */}
      <Router>
        {/* We render AppContent here, which contains all your routes and the toast */}
        <AppContent /> 
      </Router>
    </AuthProvider>
  );
}

export default App;

