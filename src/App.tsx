// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login'; 
import Register from './pages/Register'; 
import CustomerList from './pages/CustomerList';
import CustomerDetail from './pages/CustomerDetail';
import NotFound from './pages/NotFound';
import AppLayout from './components/common/AppLayout';

import './styles/App.css'; 

const App: React.FC = () => {
  return (
    // BrowserRouter và QueryClientProvider đã được đặt ở main.tsx
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* ✅ CẤU TRÚC LAYOUT ROUTE CHUẨN */}
      {/* Tất cả các Route con bên trong sẽ được bọc bởi AppLayout */}
      <Route path="/" element={<AppLayout />}>
        {/* Khi ở trang gốc, tự động chuyển đến /customers */}
        <Route index element={<Navigate to="/customers" replace />} />
        
        {/* Các route con không có dấu "/" ở đầu */}
        <Route path="customers" element={<CustomerList />} />
        <Route path="customers/:customerId" element={<CustomerDetail />} />
      </Route>
      
      {/* Route bắt lỗi 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;