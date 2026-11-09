
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
  Store,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
  Layers,
  FileText,
  UserRound,
} from "lucide-react";

const ExhibitorLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Logged-in user from Redux
  const { user } = useSelector((state) => state.auth);

  // Dynamic user details
  const displayName =
    user?.username ||
    user?.name ||
    user?.fullName ||
    user?.email?.split("@")[0] ||
    "Exhibitor User";

  const displayEmail = user?.email || "";
  const displayRole = user?.role || "Exhibitor Partner";

  // Avatar initials
  const avatarText =
    displayName
      .trim()
      .split(/[\s._-]+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "EX";

  // States
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] =
    useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Dynamic page title
  const getPageTitle = () => {
    const path = location.pathname;

    if (path.startsWith("/exhibitor/dashboard")) {
      return "Exhibitor Dashboard";
    }

    if (path.startsWith("/exhibitor/profile")) {
      return "My Profile";
    }

    if (path.startsWith("/exhibitor/my-applications")) {
      return "My Applications";
    }

    if (path.startsWith("/exhibitor/booth-reservation")) {
      return "Booth Reservation";
    }

    if (path.startsWith("/exhibitor/apply")) {
      return "Apply for Expo";
    }

    if (path.startsWith("/expos")) {
      return "Browse Expos";
    }

    return "Exhibitor Dashboard";
  };

  // Logout functionality
  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const result = await dispatch(logoutUser());

      if (logoutUser.fulfilled.match(result)) {
        toast.success(
          result.payload?.message || "Logout successful"
        );

        setProfileDropdownOpen(false);
        navigate("/login", { replace: true });
      } else {
        const message =
          typeof result.payload === "string"
            ? result.payload
            : result.payload?.message || "Logout failed";

        toast.error(message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Sidebar navigation items
  const navItems = [
    {
      to: "/exhibitor/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      to: "/expos",
      label: "Browse Expos",
      icon: CalendarDays,
    },
    {
      to: "/exhibitor/my-applications",
      label: "My Applications",
      icon: FileText,
    },
    {
      to: "/exhibitor/booth-reservation",
      label: "Booth Reservation",
      icon: Store,
    },
    {
      to: "/exhibitor/profile",
      label: "My Profile",
      icon: UserRound,
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 text-slate-300 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg">
              <Layers className="h-5 w-5" />
            </div>

            <div>
              <span className="block text-lg font-bold tracking-wide text-white">
                EventSphere
              </span>

              <span className="block text-xs font-medium text-indigo-400">
                Exhibitor Portal
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-6">

          <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Workspace
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/exhibitor/dashboard"}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/30"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`h-5 w-5 ${
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-indigo-400"
                      }`}
                    />

                    <span>{item.label}</span>

                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-white" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Logout */}
        <div className="border-t border-slate-800 p-4">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut className="h-5 w-5" />

            <span>
              {isLoggingOut ? "Logging out..." : "Logout"}
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">

        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md sm:px-8">

          {/* Page Title & Breadcrumb */}
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">

            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0">
              <h1 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                {getPageTitle()}
              </h1>

              <div className="mt-0.5 hidden items-center gap-2 text-xs text-slate-500 sm:flex">
                <span>Exhibitor</span>
                <span>/</span>

                <span className="truncate font-medium text-indigo-600">
                  {getPageTitle()}
                </span>
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2 sm:gap-4">

            {/* Search */}
            <div className="relative hidden md:flex">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                placeholder="Search expos, booths..."
                aria-label="Search expos and booths"
                className="w-44 rounded-xl border border-transparent bg-slate-100 py-2 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 lg:w-64"
              />
            </div>

            {/* Notifications */}
            <button
              type="button"
              className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-100"
              aria-label="View notifications"
            >
              <Bell className="h-5 w-5" />

              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white" />
            </button>

            {/* User Profile */}
            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setProfileDropdownOpen((open) => !open)
                }
                className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-100 sm:gap-3"
                aria-expanded={profileDropdownOpen}
                aria-label="User profile menu"
              >
                {/* Avatar */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-semibold text-white shadow-sm">
                  {avatarText}
                </div>

                {/* Name and Email */}
                <div className="hidden max-w-40 text-left sm:block">
                  <span className="block truncate text-sm font-semibold text-slate-800">
                    {displayName}
                  </span>

                  <span className="mt-1 block truncate text-xs text-slate-500">
                    {displayEmail || displayRole}
                  </span>
                </div>

                <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-100 bg-white py-2 shadow-xl">

                  {/* User Details */}
                  <div className="border-b border-slate-100 px-4 py-3">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-semibold text-white">
                        {avatarText}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {displayName}
                        </p>

                        {displayEmail && (
                          <p className="mt-1 break-all text-xs text-slate-500">
                            {displayEmail}
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="mt-3 text-xs capitalize text-indigo-600">
                      {displayRole}
                    </p>
                  </div>

                  {/* Dashboard */}
                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      navigate("/exhibitor/dashboard");
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </button>

                  {/* My Profile */}
                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      navigate("/exhibitor/profile");
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <UserRound className="h-4 w-4" />
                    My Profile
                  </button>

                  {/* My Applications */}
                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      navigate("/exhibitor/my-applications");
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <FileText className="h-4 w-4" />
                    My Applications
                  </button>

                  {/* Booth Reservation */}
                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      navigate("/exhibitor/booth-reservation");
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <Store className="h-4 w-4" />
                    Booth Reservation
                  </button>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex w-full items-center gap-2 border-t border-slate-100 px-4 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                  >
                    <LogOut className="h-4 w-4" />

                    <span>
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </span>
                  </button>

                </div>
              )}
            </div>
          </div>
        </header>

        {/* Nested Route Content */}
        <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default ExhibitorLayout;
