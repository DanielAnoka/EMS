import {
  Route,
  Routes,
  Navigate,
  BrowserRouter as Router,
} from "react-router-dom";
import { createRoutes, routes } from "./_routes";
import { AuthProvider } from "./context/AuthProvider";
import { Toaster } from "sonner";

function App() {
  return (
    <AuthProvider>
      <Toaster />
      <Router>
        <Routes>
          {createRoutes(routes)}

          {/* Redirect any unknown routes to landing if logged out, to dashboard if loggen in */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
