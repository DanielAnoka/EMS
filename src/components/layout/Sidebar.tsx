/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  type SVGProps,
  useMemo,
  useState,
  useEffect,
  Fragment,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Building,
  CreditCard,
  Settings,
  UserCog,
  Bell,
  LayoutDashboard,
  Briefcase,
  Wallet,
  Cog,
  ChevronDown,
  ChevronRight,
  ListPlus,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import type { Role } from "../../services/auth";

interface MenuItem {
  id: string;
  name: string;
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
  roles: Role[];
  to?: string; // optional custom path override
}

interface MenuSection {
  id: string;
  label: string;
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
  items: MenuItem[];
}

interface SidebarProps {
  isMobileMenuOpen: boolean;
  onMobileMenuClose: () => void;
}

/** ====== Items (single source of truth) ====== */
const ITEMS: Record<string, MenuItem> = {
  dashboard: {
    id: "dashboard",
    name: "Dashboard",
    icon: Home,
    roles: ["super admin", "estate admin", "tenant", "admin", "landlord"],
    to: "/dashboard",
  },
  users: {
    id: "users",
    name: "User Management",
    icon: Users,
    roles: ["super admin", "admin"],
  },
  estates: {
    id: "estates",
    name: "Estate Management",
    icon: Building,
    roles: ["super admin", "admin"],
  },
  properties: {
    id: "properties",
    name: "Properties",
    icon: Building,
    roles: ["super admin", "estate admin", "admin", "landlord"],
  },
  charges: {
    id: "charges",
    name: "Charges",
    icon: CreditCard,
    roles: ["super admin", "estate admin", "admin", "landlord", "tenant"],
  },
  payments: {
    id: "payments",
    name: "Payments",
    icon: CreditCard,
    roles: ["tenant", "landlord", "estate admin", "admin", "super admin"],
  },
  notifications: {
    id: "notifications",
    name: "Notifications",
    icon: Bell,
    roles: ["super admin", "estate admin", "tenant", "admin", "landlord"],
  },
  settings: {
    id: "settings",
    name: "Settings",
    icon: Settings,
    roles: ["super admin", "estate admin"],
  },
  attributes: {
    id: "attributes",
    name: "Attributes",
    icon: ListPlus,
    roles: ["super admin"],
  },
  // Future ideas (kept for grouping, just uncomment when ready):
  // defaulters: { id: "defaulters", name: "Defaulters", icon: AlertTriangle, roles: ["super admin", "estate admin", "admin"] },
  // reports: { id: "reports", name: "Reports", icon: BarChart3, roles: ["super admin", "estate admin", "admin"] },
  // roles: { id: "roles", name: "Roles & Permissions", icon: Shield, roles: ["super admin"] },
};

/** ====== Sections (logical groups) ======
 * Add/remove here and the UI scales automatically.
 */
const SECTIONS: MenuSection[] = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    items: [ITEMS.dashboard],
  },
  {
    id: "management",
    label: "Management",
    icon: Briefcase,
    items: [ITEMS.users, ITEMS.estates, ITEMS.properties,ITEMS.attributes],
  },
  {
    id: "finance",
    label: "Finance",
    icon: Wallet,
    items: [ITEMS.charges, ITEMS.payments],
  },
  {
    id: "communication",
    label: "Communication",
    icon: Bell,
    items: [ITEMS.notifications],
  },
  {
    id: "system",
    label: "System",
    icon: Cog,
    items: [ITEMS.settings],
  }
];

/** ====== Helpers ====== */
const STORAGE_KEY = "sidebar.openSections";

const usePersistedOpenSections = (initial: string[]) => {
  const [open, setOpen] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as string[]) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(open));
    } catch {
      // ignore persistence errors
    }
  }, [open]);

  const toggle = (id: string) =>
    setOpen((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  const openAll = (ids: string[]) => setOpen(ids);
  const closeAll = () => setOpen([]);

  return { open, toggle, openAll, closeAll };
};

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileMenuOpen,
  onMobileMenuClose,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role } = useAuth();

  const canSee = (item: MenuItem) =>
    !!role && item.roles.includes(role as Role);

  const visibleSections = useMemo(() => {
    return SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter(canSee),
    })).filter((section) => section.items.length > 0);
  }, [role]);

  const initialOpen = useMemo(() => visibleSections.map((s) => s.id), []);

  const { open, toggle } = usePersistedOpenSections(initialOpen);

  const activeId = useMemo(() => {
    const path = location.pathname.replace(/\/+$/, "");
    if (path === "" || path === "/") return "dashboard";
    const seg = path.split("/")[1]; // "/dashboard" => "dashboard"
    return seg || "dashboard";
  }, [location.pathname]);

  const go = (item: MenuItem) => {
    const to = item.to ?? `/${item.id}`;
    navigate(to);
    onMobileMenuClose();
  };

  const isActiveItem = (itemId: string) => activeId === itemId;
  const isSectionActive = (section: MenuSection) =>
    section.items.some((i) => isActiveItem(i.id));

  return (
    <Fragment>
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
                  {user?.user.name?.toLocaleUpperCase()}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {role?.toLocaleUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-2">
            {visibleSections.map((section) => {
              const SectionIcon = section.icon;
              const openSection = open.includes(section.id);
              const active = isSectionActive(section);

              return (
                <div key={section.id}>
                  {/* Section header */}
                  <button
                    onClick={() => toggle(section.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg
                      ${active ? "bg-blue-50" : "bg-white hover:bg-gray-50"}`}
                  >
                    <span className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                      <SectionIcon className="w-4 h-4" />
                      {section.label}
                    </span>
                    {openSection ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </button>

                  {/* Items */}
                  {openSection && (
                    <div className="px-2 pb-2">
                      {section.items.map((item) => {
                        const ItemIcon = item.icon;
                        const activeItem = isActiveItem(item.id);
                        return (
                          <button
                            key={item.id}
                            onClick={() => go(item)}
                            className={`w-full mt-1 flex items-center px-3 py-2 text-sm rounded-md transition-colors
                              ${
                                activeItem
                                  ? "bg-blue-100 text-blue-700 border-r-2 border-blue-600"
                                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                              }`}
                          >
                            <ItemIcon className="w-4 h-4 mr-2" />
                            {item.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
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
    </Fragment>
  );
};
