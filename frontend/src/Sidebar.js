import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
//import { Link } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { BsPerson } from 'react-icons/bs';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { AiOutlineFileSearch } from 'react-icons/ai';
import { MdPersonAdd } from 'react-icons/md';
import { useAuth } from './AuthContext';
import MedikLogo from '../src/images/MedikLogo.png';

const Sidebar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleProtectedRoute = (path) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="sidebar bg-primary text-white d-flex flex-column">
      <div className="sidebar-header text-center my-4">
        <img src={MedikLogo} alt="Logo" className="img-fluid mb-3" width="100" />
        <h4>Medik.ai</h4>
      </div>
      <nav className="flex-grow-1">
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink className="nav-link text-white" to="/" activeClassName="active">
              <AiOutlineFileSearch size={20} className="mr-2" />
              Scans
            </NavLink>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="#" onClick={() => handleProtectedRoute('/history')}>
              <HiOutlineDocumentText size={20} className="mr-2" />
              History
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="#" onClick={() => handleProtectedRoute('/profile')}>
              <BsPerson size={20} className="mr-2" />
              Profile
            </a>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link text-white" to="/signup" activeClassName="active">
              <MdPersonAdd size={20} className="mr-2" />
              Sign Up
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        {isAuthenticated ? (
          <a className="nav-link text-white" href="#" onClick={logout}>
            <FaSignOutAlt size={20} className="mr-2" />
            Log out
          </a>
        ) : (
          <NavLink className="nav-link text-white" to="/login" activeClassName="active">
            <FaSignOutAlt size={20} className="mr-2" />
            Log in
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
