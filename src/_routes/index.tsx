import type { JSX } from "react";
import { Route } from "react-router-dom";
import type { AppRoute } from "../types/_d";
import Login from "../components/auth/Login";
import PublicRoute from "../components/auth/Public";
import MainLayout from "../components/layout/MainLayout";
import Dashboard from "../components/dashboard/Dashboard";
import LandingPage from "../components/landing/LandingPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import ForgotPassword from "../components/auth/forgotten-password";
import EstateManagement from "../components/estate/estate";
import UserManagement from "../components/users/UserManagement";
import PropertyManagement from "../components/properties/PropertyManagement";
import Charges from "../components/charges/ChargeManagement";
import TenantManagement from "../components/tenants/TenantManagement";
import NotificationsManagement from "../components/notifications/NotificationsManagement";

// APP ROUTES
export const routes: AppRoute[] = [
  { path: "/", element: LandingPage, protected: false },
  { path: "/login", element: Login, protected: false },
  { path: "/forgot-password", element: ForgotPassword, protected: false },

  //protected
  {
    path: "/dashboard",
    element: MainLayout,
    protected: true,
    children: [{ index: true, element: Dashboard, protected: true }],
  },
  {
    path: "/estates",
    element: MainLayout,
    protected: true,
    children: [{ index: true, element: EstateManagement, protected: true }],
  },
  {
    path: "/users",
    element: MainLayout,
    protected: true,
    children: [{ index: true, element: UserManagement, protected: true }],
  },
  {
    path: "/properties",
    element: MainLayout,
    protected: true,
    children: [{ index: true, element: PropertyManagement, protected: true }],
  },
  {
    path: "/charges",
    element: MainLayout,
    protected: true,
    children: [{ index: true, element: Charges, protected: true }],
  },

  {
    path: "/tenants",
    element: MainLayout,
    protected: true,
    children: [{ index: true, element: TenantManagement, protected: true }],
  },
  {
    path: "/notifications",
    element: MainLayout,
    protected: true,
    children: [{ index: true, element: NotificationsManagement, protected: true }],
  },
];

// FUNCTION TO CREATE PROTECTED AND PUBLIC ROUTES
export function createRoutes(routes: AppRoute[]): React.ReactNode {
  return routes.map(
    (
      {
        path,
        element: Component,
        protected: isProtected,
        index: isIndex,
        children,
      },
      idx
    ) => {
      let wrappedElement: JSX.Element = <Component />;

      if (isProtected) {
        wrappedElement = <ProtectedRoute>{<Component />}</ProtectedRoute>;
      } else {
        wrappedElement = <PublicRoute>{<Component />}</PublicRoute>;
      }

      // If it's an index route
      if (isIndex) {
        return <Route key={idx} index element={wrappedElement} />;
      }

      return (
        <Route key={idx} path={path} element={wrappedElement}>
          {children && createRoutes(children)}
        </Route>
      );
    }
  );
}
