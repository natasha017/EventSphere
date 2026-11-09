
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/slice/authSlice";
import { toast } from "react-toastify";

import {
  Layers,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Role-based Dashboard URL
  const dashboardPath =
    user?.role === "admin"
      ? "/admin/dashboard"
      : user?.role === "exhibitor"
      ? "/exhibitor/dashboard"
      : null;

  // Logout Functionality
  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setMobileMenuOpen(false);

    try {
      const result = await dispatch(logoutUser());

      if (logoutUser.fulfilled.match(result)) {
        toast.success(
          result.payload?.message || "Logout successful"
        );

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

  // Public Navigation Links
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/expos", label: "Expos" },
    { to: "/exhibitors", label: "Exhibitors" },
    { to: "/schedule", label: "Schedule" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-8">

        {/* Logo */}
        <div className="flex items-center space-x-3">
          <NavLink
            to="/"
            className="group flex items-center space-x-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/25 transition-transform group-hover:scale-105">
              <Layers className="h-5 w-5" />
            </div>

            <span className="text-xl font-bold tracking-tight text-slate-900">
              EventSphere
            </span>
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-1 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-50 font-semibold text-indigo-600"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Authentication */}
        <div className="hidden items-center space-x-3 lg:flex">

          {!user ? (
            <>
              <NavLink
                to="/register"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
              >
                Register
              </NavLink>

              <NavLink
                to="/login"
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-700"
              >
                Login
              </NavLink>
            </>
          ) : (
            <div className="flex items-center space-x-4">

              {/* Dashboard Button */}
              {dashboardPath && (
                <NavLink
                  to={dashboardPath}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-100"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </NavLink>
              )}

              {/* User Welcome */}
              <div className="flex items-center space-x-2 rounded-xl border border-slate-200/60 bg-slate-100 px-3 py-1.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
                  {user.username
                    ? user.username.charAt(0).toUpperCase()
                    : "U"}
                </div>

                <span className="text-sm font-medium text-slate-800">
                  Welcome, {user.username || "User"}
                </span>
              </div>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="inline-flex items-center space-x-2 rounded-xl border border-rose-100 px-4 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LogOut className="h-4 w-4" />
                <span>
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </span>
              </button>

            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl p-2.5 text-slate-700 transition-colors hover:bg-slate-100"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="animate-in slide-in-from-top-2 space-y-3 border-b border-slate-200 bg-white px-4 pb-6 pt-2 shadow-xl lg:hidden">

          {/* Navigation Links */}
          <div className="space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-50 font-semibold text-indigo-600"
                      : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile Authentication */}
          <div className="space-y-3 border-t border-slate-100 pt-4">

            {!user ? (
              <div className="grid grid-cols-2 gap-3">

                <NavLink
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full rounded-xl bg-slate-100 py-3 text-center text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200"
                >
                  Register
                </NavLink>

                <NavLink
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full rounded-xl bg-indigo-600 py-3 text-center text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700"
                >
                  Login
                </NavLink>

              </div>
            ) : (
              <div className="space-y-3">

                {/* Mobile Dashboard */}
                {dashboardPath && (
                  <NavLink
                    to={dashboardPath}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-100"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </NavLink>
                )}

                {/* User Profile */}
                <div className="flex items-center space-x-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm">
                    {user.username
                      ? user.username.charAt(0).toUpperCase()
                      : "U"}
                  </div>

                  <div>
                    <span className="block text-xs font-medium text-slate-500">
                      Signed in as
                    </span>

                    <span className="text-sm font-bold text-slate-800">
                      {user.username || "User"}
                    </span>
                  </div>
                </div>

                {/* Mobile Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex w-full items-center justify-center space-x-2 rounded-xl bg-rose-50 py-3 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
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
      )}
    </header>
  );
};

export default Navbar;
