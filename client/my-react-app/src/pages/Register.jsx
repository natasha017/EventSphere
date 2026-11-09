import { useState } from "react";
import api from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Layers, UserPlus, Mail, Lock, UserCheck, Loader2, Sparkles, Calendar, Users } from "lucide-react";
import { useDispatch } from "react-redux";
import { fetchUser } from "../store/slice/authSlice";

const Register = () => {
  //state  
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "attendee"
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //handleInput  
  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setUser({
      ...user,
      [name]: value
    });
  };

  //handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      // Step 1: Register user
      const response = await api.post("/auth/register", user);

      if (response.status === 201) {

        const result = await dispatch(fetchUser());

        setUser({
          username: "",
          email: "",
          password: "",
          role: "attendee",
        });

        // Step 3: Check whether user data was fetched
        if (fetchUser.fulfilled.match(result)) {

          const loggedInUser = result.payload;

          toast.success(
            response.data.message || "Registration successful!"
          );

          // Step 4: Role-based navigation
          if (loggedInUser?.role === "admin") {
            navigate("/admin/dashboard");
          }
          else if (loggedInUser?.role === "exhibitor") {
            navigate("/exhibitor/dashboard");
          }
          else {
            navigate("/");
          }

        } else {
          toast.success(
            response.data.message || "Registration successful!"
          );

          toast.info("Please login to continue.");

          navigate("/login");
        }
      }

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50 flex flex-col lg:flex-row">
      {/* Left Branding Section (Desktop Split-Screen) */}
      <div className="lg:w-1/2 bg-slate-900 text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Background Decorative Glow */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Logo */}
        <div className="relative z-10 flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Layers className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            EventSphere
          </span>
        </div>

        {/* Center Content */}
        <div className="relative z-10 my-12 lg:my-0 space-y-6 max-w-lg">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold bg-indigo-500/10 text-indigo-400 px-3 py-1.5 rounded-xl border border-indigo-500/20">
            <Sparkles className="h-4 w-4" />
            <span>Expo & Trade Show Management Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Join EventSphere Today.
          </h1>

          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Create your account and become part of the expo and exhibition community. Connect with exhibitors, discover industry-leading events, and manage your participation seamlessly.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Global Expos</p>
                <p className="text-xs text-slate-400">Discover trade shows</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Exhibitors</p>
                <p className="text-xs text-slate-400">Network & grow</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-slate-500">
          &copy; {new Date().getFullYear()} EventSphere Management. All rights reserved.
        </div>
      </div>

      {/* Right Form Section */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10">

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Registration Form
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Please enter your details to create your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
              >
                Username
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserPlus className="h-4 w-4" />
                </div>

                <input
                  type="text"
                  required
                  autoComplete="off"
                  id="username"
                  value={user.username}
                  onChange={handleInput}
                  name="username"
                  placeholder="Enter your name"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
              >
                Email Address
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>

                <input
                  type="email"
                  required
                  autoComplete="off"
                  id="email"
                  value={user.email}
                  onChange={handleInput}
                  name="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
              >
                Password
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>

                <input
                  type="password"
                  required
                  autoComplete="off"
                  id="password"
                  value={user.password}
                  onChange={handleInput}
                  name="password"
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2"
              >
                Role
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserCheck className="h-4 w-4" />
                </div>

                <select
                  name="role"
                  value={user.role}
                  onChange={handleInput}
                  id="role"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                >
                  <option value="exhibitor">Exhibitor</option>
                  <option value="attendee">Attendee</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Register Now</span>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center mt-6 pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                Login
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
