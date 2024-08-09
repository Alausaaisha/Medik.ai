import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:5500/login', credentials);
        if (response.data.userId) {
          // Login successful
          login(response.data.userId);
          navigate('/');
        } else {
          // Alert user if login failed due to incorrect email or password
          alert('Login unsuccessful. Please check your email and password.');
        }
      } catch (error) {
        // Handle server errors or network issues
        console.error('Login failed', error);
        alert('Login failed. Please try again.');
      }
    // Here you can add authentication logic
    // For example, call an API to authenticate the user
    // login();
    // navigate('/');
    };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Log in
        </button>
      </form>
    </div>
  );
};

export default Login;
