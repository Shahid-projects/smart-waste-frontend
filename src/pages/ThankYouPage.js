import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaLeaf, FaRecycle, FaHeart, FaStar } from 'react-icons/fa';
import { FiCheckCircle } from 'react-icons/fi';
import './ThankYouPage.css';

const ThankYouPage = () => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    // If countdown reaches zero, redirect to home
    if (countdown === 0) {
      navigate('/');
    }
    // Set up a timer to decrease the countdown every second
    const timer = setInterval(() => {
      setCountdown(prevCountdown => prevCountdown - 1);
    }, 1000);
    // Clean up the timer when the component unmounts
    return () => clearInterval(timer);
  }, [countdown, navigate]);

  return (
    <div className="thank-you-page">
      <div className="thank-you-container">
        <FiCheckCircle className="thank-you-checkmark" />
        <h1>Thank You!</h1>
        <p className="thank-you-subtitle">
          You're making a positive impact on our environment! Every properly sorted
          waste item contributes to a cleaner, greener future for everyone.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <FaLeaf />
            <span>Eco-Friendly</span>
          </div>
          <div className="feature-card">
            <FaRecycle />
            <span>Recyclable</span>
          </div>
          <div className="feature-card">
            <FaHeart />
            <span>Earth Lover</span>
          </div>
        </div>

        <div className="impact-card-thanks">
          <h3>
            <FaStar className="sparkle-icon" />
            Environmental Impact
            <FaStar className="sparkle-icon" />
          </h3>
          <p>
            Your action today helps reduce landfill waste and promotes recycling. Together, we can make our planet healthier!
          </p>
        </div>

        <Link to="/" className="btn btn-primary back-home-btn">
          Back to Home
        </Link>
        <p className="redirect-timer">
          Redirecting to home page in {countdown} seconds...
        </p>
      </div>
    </div>
  );
};

export default ThankYouPage;