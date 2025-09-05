import React, { type SVGProps } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Building,
  CreditCard,
  Settings,
  Shield,
  UserCog,
  BarChart3,
  Bell,
  AlertTriangle,
  User2,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import type { Role } from "../../services/auth";

interface MenuItem {
  id: string;
  name: string;
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
  roles: Role[]; 
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: Home,
    roles: ["super admin", "estate admin", "tenant", "admin", "landlord"],
  },
  {
    id: "users",
    name: "User Management",
    icon: Users,
    roles: ["super admin", "admin"],
  },
  {
    id: "estates",
    name: "Estate Management",
    icon: Building,
    roles: ["super admin", "admin"],
  },
  {
    id: "properties",
    name: "Properties",
    icon: Building,
    roles: ["super admin", "estate admin", "admin", "landlord"],
  },
  {
    id: "charges",
    name: "Charges",
    icon: CreditCard,
    roles: ["super admin", "estate admin", "admin"],
  },
  {
    id: "payments",
    name: "Payments",
    icon: CreditCard,
    roles: ["tenant"],
  },
  {
    id: "defaulters",
    name: "Defaulters",
    icon: AlertTriangle,
    roles: ["super admin", "estate admin", "admin"],
  },
  {
    id: "reports",
    name: "Reports",
    icon: BarChart3,
    roles: ["super admin", "estate admin", "admin"],
  },
  {
    id: "notifications",
    name: "Notifications",
    icon: Bell,
    roles: ["super admin", "estate admin", "tenant", "admin", "landlord"],
  },
  {
    id: "roles",
    name: "Roles & Permissions",
    icon: Shield,
    roles: ["super admin"],
  },
  {
    id: "settings",
    name: "Settings",
    icon: Settings,
    roles: ["super admin", "estate admin"],
  },
  {
    id: "tenants",
    name: "Tenants",
    icon: User2,
    roles: ["landlord"],
  },
];

interface SidebarProps {
  isMobileMenuOpen: boolean;
  onMobileMenuClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileMenuOpen,
  onMobileMenuClose,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role } = useAuth();

  const filteredMenuItems = menuItems.filter(
    (item) => role && item.roles.includes(role as Role)
  );

  const handleItemClick = (itemId: string) => {
    if (itemId === "dashboard") {
      navigate("/dashboard");
    } else {
      navigate(`/${itemId}`);
    }
    onMobileMenuClose();
  };

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === "/dashboard" || path === "/dashboard/") {
      return "dashboard";
    }
    const segments = path.split("/");
    return segments[segments.length - 1] || "dashboard";
  };

  const activeTab = getActiveTab();

  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onMobileMenuClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:shadow-none
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">EstateHub</span>
            </div>
          </div>

          {/* User info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <UserCog className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  {user?.user.name}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {role?.toLocaleUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`
                    w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-150
                    ${
                      isActive
                        ? "bg-blue-100 text-blue-700 border-r-2 border-blue-600"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              Estate Management v1.0
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
