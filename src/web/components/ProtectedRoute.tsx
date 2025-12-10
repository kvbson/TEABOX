import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface Props {
  isLoggedIn: boolean;
  children: ReactNode;
}

const ProtectedRoute = ({ isLoggedIn, children }: Props) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
