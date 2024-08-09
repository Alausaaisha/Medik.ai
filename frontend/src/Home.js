import React, { useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import './Home.css';
//import illustration from './path-to-illustration.png'; // Update this path to your illustration
//import cloudIcon from './path-to-cloud-icon.png'; // Update this path to your cloud icon
import axios from 'axios';

const Home = () => {
  const fileInputRef = useRef(null);
  const { isAuthenticated, user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

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
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('https://your-backend-server.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        setUploadSuccess(true);
        setUploadError(null);
        console.log("File uploaded successfully:", response.data);
      }
    } catch (error) {
      setUploadError("File upload failed. Please try again.");
      console.error("File upload error:", error);
    }
  };

  return (
    <div className="main-content p-4 flex-grow-1">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h4>Scans</h4>
        <div className="user-info d-flex align-items-center">
          {isAuthenticated && <span className="mr-2">{user.fullName}</span>}
          <img src="user-avatar-url" alt="User Avatar" className="rounded-circle" width="40" height="40" />
        </div>
      </header>
      <div className="content d-flex justify-content-between align-items-center">
        <div className="upload-section mb-4 text-center">
          <img src='{illustration}' alt="Illustration" className="img-fluid mb-3" />
          <div className="upload-card bg-light p-4 text-center">
            <div className="upload-icon mb-3" onClick={handleUploadClick} style={{ cursor: 'pointer' }}>
              <img src='{cloudIcon}' alt="Cloud Icon" className="img-fluid" width="40" height="40" />
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
        </div>
        <div className="diagnosis-section bg-primary text-white p-4 text-center">
          <h5>Accurate PCOS Diagnosis</h5>
          <p>Your path to better health starts here</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
