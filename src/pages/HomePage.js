import React from 'react';
import { Link } from 'react-router-dom';
// Icons from Font Awesome (fa) and Feather Icons (fi)
import { FaArrowRight, FaRecycle, FaLeaf, FaExclamationTriangle } from 'react-icons/fa';
import { FiUpload, FiCpu, FiShield } from 'react-icons/fi';
import './HomePage.css';

const HomePage = () => {
  return (
    <main className="main-content">
      {/* HERO SECTION */}
      <section className="hero-section container">
        {/* ... (content is unchanged) ... */}
        <div className="hero-content">
          <h1 className="hero-title">
            Smart Waste
            <span className="highlight"> Classification</span>
          </h1>
          <p className="hero-subtitle">
            Upload an image of your waste and get instant classification with detailed
            segregation tips. Help create a cleaner, greener future through proper waste
            management.
          </p>
          <Link to="/classify" className="btn btn-primary hero-cta">
            <span>Start Classification</span>
            <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* INFO SECTION */}
      <section className="info-section container">
        {/* ... (content is unchanged) ... */}
        <h2 className="section-title">Understanding Waste Types</h2>
        <div className="waste-type-card"> <div className="card-icon-container"><FaRecycle /></div> <h3 className="card-title">Recyclable Waste</h3> <ul className="waste-list"> <li>Plastic bottles</li> <li>Aluminum cans</li> <li>Paper products</li> <li>Glass containers</li> <li>Cardboard boxes</li> </ul> </div>
        <div className="waste-type-card"> <div className="card-icon-container icon-organic"><FaLeaf /></div> <h3 className="card-title">Organic Waste</h3> <ul className="waste-list-plain"> <li>Food scraps</li> <li>Garden waste</li> <li>Paper napkins</li> <li>Wooden items</li> <li>Natural fibers</li> </ul> </div>
        <div className="waste-type-card"> <div className="card-icon-container icon-hazardous"><FaExclamationTriangle /></div> <h3 className="card-title">Hazardous Waste</h3> <ul className="waste-list-plain"> <li>Batteries</li> <li>Electronic devices</li> <li>Paint cans</li> <li>Chemicals</li> <li>Fluorescent bulbs</li> </ul> </div>
      </section>

      {/* HOW TO USE SECTION */}
      <section className="how-to-section">
        {/* ... (content is unchanged) ... */}
        <div className="container">
          <h2 className="section-title">How to Use EcoSort</h2>
          <div className="steps-container">
            <div className="step-item"> <div className="step-icon-circle"><FiUpload /></div> <h3>Step 1: Upload Image</h3> <p>Take a photo or upload an image of your waste item</p> </div>
            <div className="step-item"> <div className="step-icon-circle"><FiCpu /></div> <h3>Step 2: AI Analysis</h3> <p>Our system analyzes and classifies your waste type</p> </div>
            <div className="step-item"> <div className="step-icon-circle"><FaRecycle /></div> <h3>Step 3: Get Tips</h3> <p>Receive specific segregation and disposal instructions</p> </div>
            <div className="step-item"> <div className="step-icon-circle"><FiShield /></div> <h3>Step 4: Dispose Properly</h3> <p>Follow the guidelines for environmentally friendly disposal</p> </div>
          </div>
        </div>
      </section>

      {/* WASTE SAFETY GUIDELINES SECTION */}
      <section className="safety-section container">
        <h2 className="section-title">Waste Safety Guidelines</h2>
        
        {/* Harmful Waste Card */}
        <div className="safety-card">
          <h3 className="card-title-icon"> <FaExclamationTriangle /> <span>Harmful Waste</span> </h3>
          <h4 className="safety-subheading">Never Give to Children:</h4>
          <ul className="safety-list">
            <li>Batteries (contain toxic chemicals)</li>
            <li>Broken glass or sharp objects</li>
            <li>Electronic waste with small parts</li>
            <li>Chemical containers or cleaning products</li>
            <li>Medical waste or syringes</li>
          </ul>
          <h4 className="safety-subheading">Safety Precautions:</h4>
          <ul className="safety-list">
            <li>Always wear gloves when handling</li>
            <li>Keep away from food and children</li>
            <li>Store in designated containers</li>
            <li>Dispose at specialized collection centers</li>
          </ul>
        </div>

        {/* --- SAFE WASTE CARD (NEW) --- */}
        <div className="safe-card">
           <h3 className="card-title-icon-green">
             <FiShield />
             <span>Safe Waste</span>
           </h3>
           <h4 className="safety-subheading">Child-Friendly Items:</h4>
           {/* We reuse the .waste-list class here for the green bullets */}
           <ul className="waste-list">
             <li>Paper and cardboard (clean)</li>
             <li>Plastic containers (rinsed)</li>
             <li>Aluminum cans (smooth edges)</li>
             <li>Organic food waste</li>
             <li>Fabric and textiles</li>
           </ul>

           <h4 className="safety-subheading">Prevention Tips:</h4>
           <ul className="waste-list">
             <li>Reduce packaging when shopping</li>
             <li>Reuse containers and bags</li>
             <li>Choose products with minimal packaging</li>
             <li>Compost organic waste at home</li>
           </ul>
        </div>

      </section>
    </main>
  );
};

export default HomePage;