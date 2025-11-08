// src/components/common/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/Sidebar.css';
import { FaHome, FaStar, FaHashtag, FaSignOutAlt } from 'react-icons/fa';

interface SidebarProps {
  onLogout?: () => void; // 👈 Nhận hàm logout từ AppLayout
  loading?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, loading }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">CRM</div>

      <nav className="sidebar-nav">
        <NavLink to="/customers" className="sidebar-link">
          <FaHome />
          <span>Home</span>
        </NavLink>

       
      </nav>

      {/* 👇 Nút logout gọi hàm onLogout từ props */}
      <div className="logout-section">
        <button
          className="logout-btn"
          onClick={onLogout}
          disabled={loading}
          aria-busy={loading}
          title="Đăng xuất"
        >
          <FaSignOutAlt />
        </button>
      </div>

      <style>{`
        .logout-section {
          margin-top: auto;
          padding: 20px 0;
          display: flex;
          justify-content: center;
          border-top: 1px solid #222;
        }
        .logout-btn {
          background: none;
          border: none;
          cursor: pointer;
        }
        .logout-btn[disabled] {
          cursor: not-allowed;
          opacity: 0.6;
        }
        .logout-btn svg {
          color: #ff4d4d;
          font-size: 20px;
          transition: color 0.2s ease, transform 0.1s ease;
        }
        .logout-btn:hover svg {
          color: #ff6666;
        }
        .logout-btn[aria-busy="true"] svg {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
