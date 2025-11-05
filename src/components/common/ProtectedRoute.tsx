// src/components/common/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';

const useAuth = () => {
  const token = localStorage.getItem('accessToken'); 
  return !!token;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;