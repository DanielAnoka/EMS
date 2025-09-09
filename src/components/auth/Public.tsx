import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
// import { LoadingSpinner } from "../ui/Loaders";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoadingCurrentUser } = useAuth();

  if (isLoadingCurrentUser) {
      return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
