import React, { useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import './Home.css';
import medical_illustration from '../src/images/medical_illustration.png';
import cloudIcon from '../src/images/cloudIcon.svg';
import axios from 'axios';

const Home = () => {
  const fileInputRef = useRef(null);
  const { isAuthenticated, user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null); // State to store prediction result
  const [confidenceResult, setConfidenceResult] = useState(null); // State to store confidence result

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
      setUploadSuccess(false);
      console.log("File selected:", file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        setUploadSuccess(true);
        setUploadError(null);
        setPredictionResult(response.data.prediction); // Update prediction result
        setConfidenceResult(response.data.confidence); // Update confidence result
        console.log("File uploaded successfully:", response.data);
      }
    } catch (error) {
      setUploadError("File upload failed. Please try again.");
      console.error("File upload error:", error);
      console.log("Error details:", error.response ? error.response.data : "No response data");
    }
  };

  return (
    <div className="main-content p-4 flex-grow-1">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h4>Scans</h4>
        <div className="user-info d-flex align-items-center">
          {isAuthenticated && <span className="mr-2">{user?.fullName  ? user.fullName : ''}</span>}
          <img src="user-avatar-url" alt="User Avatar" className="rounded-circle" width="40" height="40" />
        </div>
      </header>
      <div className="content d-flex justify-content-between align-items-center">
        <div className="upload-section mb-4 text-start">
          {/* <img src={medical_illustration} alt="Illustration" className="img-fluid mb-3" /> */}
          <div className="upload-card bg-light p-4 text-center">
            <div className="upload-icon mb-3" onClick={handleUploadClick} style={{ cursor: 'pointer' }}>
              <img src={cloudIcon} alt="Cloud Icon" className="img-fluid" width="40" height="40" />
            </div>
            <p>Click to upload ultrasound image</p>
            <p>JPG, PDF (max. 800x400px)</p>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
              accept=".jpg, .jpeg, .png, .pdf"
            />
            {selectedFile && (
              <div className="mt-3">
                <p>Selected file: {selectedFile.name}</p>
                {selectedFile.type.startsWith('image/') && (
                  <img src={URL.createObjectURL(selectedFile)} alt="Selected preview" className="img-fluid mt-2" />
                )}
              </div>
            )}
            <button className="btn btn-primary mt-3" onClick={handleFileUpload}>Upload scan</button>
          </div>
          {uploadError && (
            <div className="mt-3 text-danger">
              <p>{uploadError}</p>
            </div>
          )}
          {uploadSuccess && (
            <div className="mt-3 text-success">
              <p>File uploaded successfully!</p>
            </div>
          )}
          {predictionResult && (
            <div className="mt-3 text-info">
              <p>Prediction Result: {predictionResult}</p>
              <p>Confidence: {confidenceResult}</p>
            </div>
          )}
        </div>
        <div className="illustration-section">
          <img src={medical_illustration} alt="Illustration" className="img-fluid" />
        </div>
      </div>
    </div>
  );
};

export default Home;
