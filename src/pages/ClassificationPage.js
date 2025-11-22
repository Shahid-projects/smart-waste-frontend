import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
// Using window.location for full page navigation instead of useNavigate (safer for full app context)
import axios from 'axios';
// FIX: Using Lucide React and Font Awesome (Fa icons are more stable than Fi)
import { Upload, Image as ImageIcon, Camera, ArrowRight, ArrowLeft, Check, Recycle, Info } from 'lucide-react'; 
import './ClassificationPage.css';

// Define the API URL for deployment
const API_URL = 'https://smart-waste-backend.vercel.app/api/classify';


const ClassificationPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showTips, setShowTips] = useState(false);

  const onDrop = useCallback(acceptedFiles => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        setResult(null);
        setShowTips(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.webp'] },
    noKeyboard: true
  });

  const handleClassify = async () => {
    if (!file) {
      // FIX: Use a custom alert/notification instead of alert()
      alert("Please upload an image first!"); 
      return;
    }
    
    setIsLoading(true);

    const formData = new FormData();
    formData.append('wasteImage', file); // Key must match backend: 'wasteImage'

    try {
      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setResult(res.data);

    } catch (err) {
      console.error('Error uploading file:', err);
      // FIX: Provide more specific error messaging from the backend if possible
      alert(err.response?.data?.error || err.response?.data?.msg || 'There was an error classifying the image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleShowTips = () => setShowTips(true);
  const handleBackToResults = () => setShowTips(false);
  
  const handleDone = () => {
    // FIX: Using window.location for navigation
    window.location.href = 'https://smart-waste-frontend.vercel.app/thank-you'; 
  };
  
  const handleTakePhoto = () => {
    alert("Camera functionality is a future enhancement!");
  };

  // --- RENDERING TIPS PAGE ---
  if (showTips && result) {
    return (
      <div className="classification-page">
        <div className="tips-page-container">
          <button onClick={handleBackToResults} className="back-link">
            <ArrowLeft /> Back to Results
          </button>
          <div className="tips-header">
            <h1>Segregation Tips</h1>
            <p>Follow these steps to properly dispose of your <strong>{result.name}</strong></p>
          </div>
          <div className="tips-section">
            <h2 className="tips-subheading">Step-by-Step Instructions</h2>
            <div className="tips-list">
              {result.tips.map((tip, index) => (
                <div key={index} className="tip-step">
                  <div className="tip-number">{index + 1}</div>
                  <p>{tip}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="tips-section">
            <div className="impact-card">
              {/* FIX: Using Lucide Icon: Recycle */}
              <h3 className="impact-title"><Recycle /> Environmental Impact</h3>
              <p>{result.impact}</p>
            </div>
          </div>
          {/* FIX: Using Lucide Icon: Check */}
          <button onClick={handleDone} className="btn btn-primary done-button"><Check /> Mark as Done</button>
        </div>
      </div>
    );
  }

  // --- RENDERING LOADING STATE ---
  if (isLoading) {
    return (
      <div className="classification-page loading-state">
        <div className="custom-spinner-wrapper">
          <div className="custom-spinner">
            <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
          </div>
        </div>
        <div className="loading-text-container">
          <h2>Analyzing Image...</h2>
          <p>Our AI is working its magic to classify your item.</p>
        </div>
      </div>
    );
  }

  // --- RENDERING RESULTS STATE ---
  if (result) {
    return (
      <div className="classification-page result-state">
        <div className="result-main-card">
          <div className="result-section">
            <h2 className="section-heading">Uploaded Image</h2>
            <div className="uploaded-image-wrapper"> <img src={preview} alt="Uploaded item" /> </div>
          </div>
          <div className="result-section">
            <h2 className="section-heading">Classification Results</h2>
            <div className="result-header"> 
              {/* FIX: Using Lucide Icon: Recycle */}
              <Recycle className="result-icon" /> 
              <div className="result-title"> 
                <h3>{result.name}</h3> 
                <p>{result.category}</p> 
              </div> 
            </div>
            <div className="confidence-section"> 
              <p className="confidence-label">Confidence Level</p> 
              <div className="progress-bar"> 
                <div className="progress-bar-fill" style={{width: `${result.confidence}%`}}></div> 
              </div> 
              <p className="confidence-percent">{result.confidence}% confident</p> 
            </div>
            <div className="quick-info-box"> 
              {/* FIX: Using Lucide Icon: Info */}
              <h4><Info /> Quick Info</h4> 
              <p>{result.info}</p> 
            </div>
          </div>
          {/* FIX: Using Lucide Icon: ArrowRight */}
          <button onClick={handleShowTips} className="btn btn-primary tips-button"> Get Segregation Tips <ArrowRight /> </button>
        </div>
      </div>
    );
  }

  // --- RENDERING UPLOAD STATE ---
  return (
    <div className="classification-page">
       <div className="upload-container">
        <div className="upload-header">
          <h1>Upload Your Waste Image</h1>
          <p>Take a clear photo of your waste item for accurate classification</p>
        </div>
        <div className="upload-area">
          <div {...getRootProps({ className: `dropzone ${isDragActive ? 'dropzone-active' : ''} ${preview ? 'has-preview' : ''}` })}>
            <input {...getInputProps()} />
            {preview ? (
              <div className="image-preview-wrapper">
                <img src={preview} alt="Selected preview" className="preview-in-dropzone" />
                <p className="change-image-text">Click to change image</p>
              </div>
            ) : (
              <div className="upload-prompt">
                {/* FIX: Using Lucide Icon: Upload */}
                <Upload className="dropzone-icon" />
                <p className="dropzone-text-bold">{isDragActive ? "Drop the image here..." : "Drop your image here"}</p>
                <p className="dropzone-text-light">or click to browse</p>
              </div>
            )}
          </div>
          <div className="button-group">
            {/* FIX: Using Lucide Icons: ImageIcon, Camera */}
            <button onClick={open} className="btn btn-blue"><ImageIcon /> Choose File</button>
            <button onClick={handleTakePhoto} className="btn btn-purple"><Camera /> Take Photo</button>
          </div>
          {preview && (
            // FIX: Using Lucide Icon: ArrowRight
            <button onClick={handleClassify} className="btn btn-primary classify-btn-main">
              Classify Waste <ArrowRight />
            </button>
          )}
        </div>
        <div className="guidelines-container">
            <div className="guideline-card"> <h3>Photo Guidelines</h3> <ul className="guideline-list"> <li>Ensure good lighting for clear visibility</li> <li>Center the waste item in the frame</li> <li>Avoid cluttered backgrounds</li> <li>Include any visible labels or markings</li> </ul> </div>
            <div className="guideline-card format-card"> <h3>Supported Formats</h3> <p>JPG, PNG, WEBP files up to 10MB. For best results, use images with good resolution and lighting.</p> </div>
        </div>
      </div>
    </div>
  );
};

export default ClassificationPage;