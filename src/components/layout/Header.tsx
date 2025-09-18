import React from "react";
import { Menu, LogOut, User, Settings } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

import { storage } from "../../utils/storage";
import NotificationBell from "../notifications/NotificationBell";
import Cart from "../cart/cartManagment";

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle }) => {
  const { user, role } = useAuth();
  const handleLogout = () => {
    storage.removeToken();
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="hidden lg:flex items-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Estate Management
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          {/* <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button> */}
          <NotificationBell />

          {role === "tenant" && <Cart />}

          {/* User menu */}
          <div className="relative group">
            <button className="flex items-center space-x-3 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium text-gray-900">
                  {user?.user?.name?.toLocaleUpperCase()}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {role?.toLocaleUpperCase()}
                </div>
              </div>
            </button>

            {/* Dropdown menu */}
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-2">
                <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </button>
                <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </button>
                <hr className="my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
