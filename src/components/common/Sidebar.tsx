// src/components/common/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/Sidebar.css'; 

import { FaHome, FaStar, FaHashtag } from 'react-icons/fa';

const Sidebar: React.FC = () => {
  // Chưa có logout, TODO


  return (
    <div className="sidebar">
      <div className="sidebar-header">
        CRM
      </div>
      
      <nav className="sidebar-nav">
        <NavLink 
          to="/customers" 
          className="sidebar-link"
        >
          <FaHome />
          <span>Home</span>
        </NavLink>
        
        <NavLink 
          to="/favorites" 
          className="sidebar-link"
        >
          <FaStar />

        </NavLink>
        
        <NavLink 
          to="/explore" 
          className="sidebar-link"
        >
          <FaHashtag />
        </NavLink>
      </nav>

    </div>
  );
};

export default Sidebar;