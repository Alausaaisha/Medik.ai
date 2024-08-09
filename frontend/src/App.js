import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom';
import Sidebar from './Sidebar';
import Home from './Home';
import History from './History';
import Login from './Login';
import SignUp from './SignUp';
import './App.css';
import { useAuth } from './AuthContext';


const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className='app d-flex'>
        <Sidebar />
        <div className="main-content-container flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/history" element={isAuthenticated ? <History /> : <Navigate to='/login' />} />
              {/* <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} /> */}
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
      </div>
    </Router>
  )
}
export default App;
