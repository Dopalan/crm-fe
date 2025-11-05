// src/components/common/Sidebar.tsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../../styles/Sidebar.css';
import { FaHome, FaStar, FaHashtag, FaSignOutAlt } from 'react-icons/fa';
import { message } from 'antd';
import { logoutApi } from '../../api/auth';
import { useAuthStore } from '../../store/auth';

const Sidebar: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);
    try {
      
      await logoutApi();

      
      logout?.();
      message.success('Đăng xuất thành công!');
      navigate('/login', { replace: true });
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message || err?.message || 'Đăng xuất thất bại!';
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">CRM</div>

      <nav className="sidebar-nav">
        <NavLink to="/customers" className="sidebar-link">
          <FaHome />
          <span>Home</span>
        </NavLink>

        <NavLink to="/favorites" className="sidebar-link">
          <FaStar />
        </NavLink>

        <NavLink to="/explore" className="sidebar-link">
          <FaHashtag />
        </NavLink>
      </nav>

      
      <div className="logout-section">
        <button
          className="logout-btn"
          onClick={handleLogout}
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
