import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LoadingSpinner } from "../ui/Loaders";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoadingCurrentUser } = useAuth();

  if (isLoadingCurrentUser) {
    return <LoadingSpinner fullScreen />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
