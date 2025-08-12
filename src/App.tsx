import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./components/landing/LandingPage";
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/forgotten-password";
import {AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          } />

          {/* Redirect any unknown routes to landing */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
