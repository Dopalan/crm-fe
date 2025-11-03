// src/components/common/AppLayout.tsx
import React from 'react';
import Sidebar from './Sidebar';
import '../../styles/Layout.css'; 

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;