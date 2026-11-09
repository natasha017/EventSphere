
import { useState } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/slice/authSlice";
import { toast } from "react-toastify";

import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Clock,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  Grid3X3,
  House,
  ChevronDown,
  User,
} from "lucide-react";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);

  const displayName =
    user?.username || user?.name || "Admin";

  const email = user?.email || "admin@example.com";

  const role = user?.role || "admin";

  const avatarInitials = displayName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Sidebar navigation items
  const navItems = [
    {
      to: "/",
      label: "Website Home",
      icon: House,
    },
    {
      to: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      to: "/admin/expos",
      label: "Expo Management",
      icon: CalendarDays,
    },
    {
      to: "/admin/exhibitors",
      label: "Exhibitor Management",
      icon: Users,
    },
    {
      to: "/admin/booths",
      label: "Booth Management",
      icon: Grid3X3,
    },
    {
      to: "/admin/schedule",
      label: "Schedule Management",
      icon: Clock,
    },
  ];

  // Logout function
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();

      toast.success("Logout successfully!");

      navigate("/login");
    } catch (error) {
      toast.error(error || "Logout failed");
    }
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-slate-950 text-white transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Event<span className="text-indigo-400">Sphere</span>
            </h1>

            <p className="mt-1 text-xs text-slate-400">
              Admin Dashboard
            </p>
          </div>

          <button
            onClick={closeSidebar}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">

          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Main Menu
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                      : "text-slate-400 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={20} />

                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Admin Profile Bottom */}
        <div className="border-t border-white/10 p-4">

          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
              {avatarInitials}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {displayName}
              </p>

              <p className="truncate text-xs capitalize text-slate-400">
                {role}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="min-h-screen lg:ml-72">

        {/* Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">

          {/* Left Side */}
          <div className="flex items-center gap-4">

            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={24} />
            </button>

            <div>
              <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                Admin Panel
              </h2>

              <p className="hidden text-xs text-slate-500 sm:block">
                Manage your EventSphere platform
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">

            {/* Search */}
            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
              <Search size={18} className="text-slate-400" />

              <input
                type="text"
                placeholder="Search..."
                className="w-36 bg-transparent text-sm outline-none lg:w-48"
              />
            </div>

            {/* Notifications */}
            <button
              type="button"
              className="relative rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100"
            >
              <Bell size={21} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">

              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-xl p-2 transition hover:bg-slate-100"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                  {avatarInitials}
                </div>

                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold text-slate-800">
                    {displayName}
                  </p>

                  <p className="text-xs capitalize text-slate-500">
                    {role}
                  </p>
                </div>

                <ChevronDown
                  size={16}
                  className="hidden text-slate-500 sm:block"
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-14 z-50 w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">

                  <div className="border-b border-slate-100 px-3 py-3">
                    <p className="text-sm font-semibold text-slate-800">
                      {displayName}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {email}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      navigate("/admin/dashboard");
                      setProfileOpen(false);
                    }}
                    className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </button>

                  <button
                    onClick={() => {
                      navigate("/");
                      setProfileOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100"
                  >
                    <House size={18} />
                    Website Home
                  </button>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
