import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";


const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user, isLoadingCurrentUser } = useAuth();

  if (isLoadingCurrentUser) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
