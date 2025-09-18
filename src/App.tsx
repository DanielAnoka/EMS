import {
  Route,
  Routes,
  Navigate,
  BrowserRouter as Router,
} from "react-router-dom";
import { createRoutes, routes } from "./_routes";
import { AuthProvider } from "./context/AuthProvider";
import { Toaster } from "sonner";
import CartProvider from "./context/CartProvider";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster />
        <Router>
          <Routes>
            {createRoutes(routes)}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}


export default App;
