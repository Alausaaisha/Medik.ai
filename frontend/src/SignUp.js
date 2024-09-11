import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.css';
import medical_illustration1 from '../src/images/medical_illustration1.png';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' })); // Clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple form validation
    if (!formData.fullName || !formData.email || !formData.mobileNumber || !formData.password) {
      setFormErrors({
        fullName: !formData.fullName ? 'Full Name is required' : '',
        email: !formData.email ? 'Email is required' : '',
        mobileNumber: !formData.mobileNumber ? 'Mobile Number is required' : '',
        password: !formData.password ? 'Password is required' : ''
      });
      return; // Prevent submission if validation fails
    }

    // Email format validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setFormErrors(prev => ({ ...prev, email: 'Invalid email format' }));
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/signup', formData);

      if (response.status === 201) {
        alert('Signup successful! Please login.');
        navigate('/login'); // Redirect to login after successful signup
      } else {
        alert('Signup error.');
      }
    } catch (error) {
        if (error.response) {
          console.error('Signup error:', error.response.data);
          alert(error.response.data.error || 'Error during signup.');
        } else {
          console.error('Signup error:', error);
          alert('An unexpected error occured.');
        }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form-container">
        <h2>Get Started by Creating a Medik Account</h2>
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
              autocomplete="name"  // Added autocomplete attribute
            />
            {formErrors.fullName && <span className="error-text">{formErrors.fullName}</span>}
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
              autocomplete="email"  // Added autocomplete attribute
            />
            {formErrors.email && <span className="error-text">{formErrors.email}</span>}
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
              autocomplete="tel"  // Added autocomplete attribute
            />
            {formErrors.mobileNumber && <span className="error-text">{formErrors.mobileNumber}</span>}
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
              autocomplete="new-password"  // Added autocomplete attribute for new passwords
            />
            {formErrors.password && <span className="error-text">{formErrors.password}</span>}
          </div>

          <button type="submit" className="signup-button">Create Account</button>
        </form>
        <p>Already have an account? <Link to="/login">Log in</Link></p>
      </div>
      <div className="signup-image-container">
        <img src={medical_illustration1} alt="Medical Illustration" />
      </div>
    </div>
  );
};

export default SignUp;