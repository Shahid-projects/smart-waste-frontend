import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // We need axios to make the API call
import { FiUpload, FiImage, FiCamera } from 'react-icons/fi';
import { FaArrowRight, FaRecycle, FaArrowLeft, FaCheck } from 'react-icons/fa';
import './ClassificationPage.css';

const ClassificationPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showTips, setShowTips] = useState(false);
  const navigate = useNavigate();

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

  // --- THIS IS THE UPDATED, "REAL" FUNCTION ---
  const handleClassify = async () => {
    if (!file) {
      alert("Please upload an image first!");
      return;
    }
    
    setIsLoading(true);

    // 1. Create a FormData object. This is the standard way to send files.
    const formData = new FormData();
    // 2. Append the file to the FormData object. The key 'wasteImage' MUST
    //    match the name we used in our backend's multer middleware.
    formData.append('wasteImage', file);

    try {
      // 3. Make the API call to our backend's classification endpoint.
      const res = await axios.post('http://localhost:5000/api/classify/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // 4. The backend's real Roboflow response is in res.data.
      //    We set it to our state to display the results page.
      setResult(res.data);

    } catch (err) {
      console.error('Error uploading file:', err);
      alert('There was an error classifying the image. Please try again.');
    } finally {
      // 5. This always runs, whether the call succeeds or fails.
      setIsLoading(false);
    }
  };
  
  // --- The rest of the functions are unchanged ---
  const handleShowTips = () => setShowTips(true);
  const handleBackToResults = () => setShowTips(false);
  const handleDone = () => {
    navigate('/thank-you');
  };
  const handleTakePhoto = () => {
    alert("Camera functionality is a future enhancement!");
  };

  // --- The rest of the component's rendering logic is also unchanged ---
  if (showTips && result) {
    return (
      <div className="classification-page">
        <div className="tips-page-container">
          <button onClick={handleBackToResults} className="back-link">
            <FaArrowLeft /> Back to Results
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
              <h3 className="impact-title"><FaRecycle /> Environmental Impact</h3>
              <p>{result.impact}</p>
            </div>
          </div>
          <button onClick={handleDone} className="btn btn-primary done-button"><FaCheck /> Mark as Done</button>
        </div>
      </div>
    );
  }

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
            <div className="result-header"> <FaRecycle className="result-icon" /> <div className="result-title"> <h3>{result.name}</h3> <p>{result.category}</p> </div> </div>
            <div className="confidence-section"> <p className="confidence-label">Confidence Level</p> <div className="progress-bar"> <div className="progress-bar-fill" style={{width: `${result.confidence}%`}}></div> </div> <p className="confidence-percent">{result.confidence}% confident</p> </div>
            <div className="quick-info-box"> <h4>Quick Info</h4> <p>{result.info}</p> </div>
          </div>
          <button onClick={handleShowTips} className="btn btn-primary tips-button"> Get Segregation Tips <FaArrowRight /> </button>
        </div>
      </div>
    );
  }

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
                <FiUpload className="dropzone-icon" />
                <p className="dropzone-text-bold">{isDragActive ? "Drop the image here..." : "Drop your image here"}</p>
                <p className="dropzone-text-light">or click to browse</p>
              </div>
            )}
          </div>
          <div className="button-group">
            <button onClick={open} className="btn btn-blue"><FiImage /> Choose File</button>
            <button onClick={handleTakePhoto} className="btn btn-purple"><FiCamera /> Take Photo</button>
          </div>
          {preview && (
            <button onClick={handleClassify} className="btn btn-primary classify-btn-main">
              Classify Waste <FaArrowRight />
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
