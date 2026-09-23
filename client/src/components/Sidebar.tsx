import { useStore } from "@/store/useStore";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Settings,
  LayoutDashboard,
  Compass,
  MapPin,
  ShieldCheck,
  Users,
  LogOut,
} from "lucide-react";
import { logout } from "@/lib/api";

export default function Sidebar() {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser); // Zustand setter to reset user state
  const navigate = useNavigate();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const sharedLinks = [
    {
      role: "shared",
      path: `/dashboard/${user?.username?.split(" ").join("") || ""}/${user?.id || ""}`,
      pathName: "Overview",
      icon: LayoutDashboard,
    },
    {
      role: "shared",
      path: "settings",
      pathName: "Settings",
      icon: Settings,
    },
    {
      role: "shared",
      path: "travel-desk",
      pathName: "Travel Desk",
      icon: Compass,
    },
  ];

  const touristLinks = [
    {
      role: "tourist",
      path: "my-bookings",
      pathName: "My Bookings",
      icon: MapPin,
    },
  ];

  const guideLinks = [
    {
      role: "guide",
      path: "trips",
      pathName: "My Trips",
      icon: Compass,
    },
  ];

  const adminLinks = [
    {
      role: "admin",
      path: "manage-users",
      pathName: "Manage Users",
      icon: Users,
    },
    {
      role: "admin",
      path: "verifications",
      pathName: "Verifications",
      icon: ShieldCheck,
    },
  ];

  const navLinks = [
    ...sharedLinks,
    ...(user?.role === "tourist" ? touristLinks : []),
    ...(user?.role === "guide" ? guideLinks : []),
    ...(user?.role === "admin" ? adminLinks : []),
  ];

  const closeMobileNav = () => setIsMobileOpen(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      logout("/auth/logout"); // Ensure route matches your backend logout endpoint
      toast.success("Logged out successfully");

      if (setUser) setUser(null); // Clear store state
      closeMobileNav();
      navigate("/auth");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to log out");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <section>
      {/* Mobile Menu Toggle Button */}
      <div>
        <button
          onClick={() => setIsMobileOpen((prev) => !prev)}
          className="lg:hidden p-2 bg-surface border border-gray-1 rounded-lg text-text-para shadow-sm fixed top-3 left-4 z-50"
          aria-label="Toggle navigation"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={closeMobileNav}
        />
      )}

      {/* Mobile Sliding Navbar */}
      <nav
        className={`mobile-sidebar fixed top-0 left-0 z-40 h-full w-64 bg-body-bg border-r border-r-gray-1 text-text-para transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col justify-between ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="p-4 border-b border-b-gray-1 font-bold text-lg text-primary mt-12">
            Dashboard
          </div>
          <ul className="flex flex-col p-4 gap-2 text-sm font-medium">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    onClick={closeMobileNav}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all ${
                        isActive
                          ? "bg-primary text-white"
                          : "hover:bg-primary/40 text-text-para"
                      }`
                    }
                  >
                    {Icon && <Icon size={18} />}
                    <span>{link.pathName}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Mobile Logout Button */}
        <div className="p-4 border-t border-t-gray-1">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg text-red-500 hover:bg-red-500/10 active:scale-95 transition-all text-sm font-medium cursor-pointer"
          >
            <LogOut size={18} />
            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      </nav>

      {/* Desktop Fixed Width / Collapsible Sidebar */}
      <aside
        className={`hidden lg:flex flex-col h-screen sticky top-0 border-r border-r-gray-1 bg-body-bg text-text-para transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Collapse / Expand Toggle Button */}
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="absolute -right-3 top-6 bg-surface border border-gray-1 text-text-para rounded-full p-1 hover:bg-gray-1/50 transition-all shadow-sm z-10 cursor-pointer"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Top Header */}
        <div className="p-4 border-b border-b-gray-1 font-bold text-lg text-primary flex items-center h-16 shrink-0">
          {!isCollapsed && <span>Dashboard</span>}
        </div>

        {/* Navigation Links Area */}
        <nav className="p-3 flex-1 overflow-y-auto">
          <ul className="flex flex-col gap-1.5 text-sm font-medium">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all ${
                        isActive
                          ? "bg-primary text-white"
                          : "hover:bg-primary/10 text-text-para"
                      } ${isCollapsed ? "justify-center px-0" : ""}`
                    }
                    title={isCollapsed ? link.pathName : undefined}
                  >
                    {Icon && <Icon size={18} />}
                    {!isCollapsed && <span>{link.pathName}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Desktop Logout Button - Absolute at Bottom */}
        <div className="p-3 border-t border-t-gray-1 shrink-0">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-red-500 hover:bg-red-500/10 active:scale-95 transition-all text-sm font-medium cursor-pointer ${
              isCollapsed ? "justify-center px-0" : ""
            }`}
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut size={18} />
            {!isCollapsed && (
              <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
            )}
          </button>
        </div>
      </aside>
      <ToastContainer />
    </section>
  );
}
