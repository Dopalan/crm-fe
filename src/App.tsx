// src/App.tsx

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login'; 
import Register from './pages/Register'; 
import CustomerList from './pages/CustomerList';
import CustomerDetail from './pages/CustomerDetail';
import NotFound from './pages/NotFound';

import './styles/App.css'; 

interface ProtectedRouteProps {
  children: React.ReactNode;
}


const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token'); 
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/customers" replace />} />

        <Route path="/login" element={<Login />} />     
        <Route path="/register" element={<Register />} /> 
        
        <Route 
          path="/customers" 
          element={
            //<ProtectedRoute>
              <AppLayout>
                <Routes> 
                  <Route path="/" element={<Navigate to="/customers" replace />} />
                  <Route path="/customers" element={<CustomerList />} />
                  <Route path="/customers/:id" element={<CustomerDetail />} />
                </Routes>
              </AppLayout>
            //</ProtectedRoute>
          } 
        />
        
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;