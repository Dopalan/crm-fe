// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login'; 
import Register from './pages/Register'; 
import CustomerList from './pages/CustomerList';
import CustomerDetail from './pages/CustomerDetail';
import NotFound from './pages/NotFound';
import AppLayout from './components/common/AppLayout';

import ProtectedRoute from './components/common/ProtectedRoute';

import './styles/App.css'; 

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="customers" element={<CustomerList />} />
        <Route path="customers/:customerId" element={<CustomerDetail />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;