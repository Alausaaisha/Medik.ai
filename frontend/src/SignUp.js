import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './SignUp.css'; // Import the CSS file for styling

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // check confirm password is valid
        if (formData.password !== formData.confirmPassword) {
          alert('password and confirm password do not match')
          return;
        }
        const response = await axios.post('http://localhost:5500/signup', formData);
        alert('Signup successful, please login.');
        navigate('/login'); // Redirect to login after successful signup
      } catch (error) {
        console.error('Signup error:', error.response ? error.response.data : error);
        alert('Error during signup.');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form-container">
        <h2>Get Started by creating a Medik account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="mobileNumber">Mobile Number</label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              placeholder="Enter mobile number"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Create Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="signup-button">Create account</button>
        </form>
        <p>Already have an account? <Link to="/login">Log in</Link></p>
      </div>
      <div className="signup-image-container">
        <img src="images/medical-illustration.png" alt="Medical Illustration" />
      </div>
    </div>
  );
};

export default SignUp;
