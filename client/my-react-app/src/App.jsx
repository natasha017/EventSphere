
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchUser } from "./store/slice/authSlice";

// Public Pages
import Home from "./pages/Home";
import Expos from "./pages/Expos";
import ExpoDetails from "./pages/ExpoDetails";
import Exhibitors from "./pages/Exhibitors";
import Schedule from "./pages/Schedule";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Authentication Pages
import Register from "./pages/Register";
import Login from "./pages/Login";
import ResetPassword from "./components/ResetPassword";
import ForgotPassword from "./components/ForgotPassword";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminExpos from "./pages/admin/AdminExpos";
import AdminSchedule from "./pages/admin/AdminSchedule";
import AdminExhibitors from "./pages/admin/AdminExhibitors ";
import AdminBooths from "./pages/admin/AdminBooths";

// Exhibitor Pages
import ExhibitorDashboard from "./pages/exhibitor/ExhibitorDashboard";
import BoothReservation from "./pages/exhibitor/BoothReservation";
import MyApplications from "./pages/exhibitor/MyApplications";
import ExhibitorProfile from "./pages/exhibitor/ExhibitorProfile";

// Layouts
import AdminLayout from "./layout/AdminLayout";
import ExhibitorLayout from "./layout/ExhibitorLayout";
import PublicLayout from "./layout/PublicLayout";

// Route Protection
import ProtectedRoutes from "./components/ProtectedRoutes";
import PublicOnlyRoute from "./components/PublicOnlyRoute";

// Other
import PageNotFound from "./pages/PageNotFound";

const App = () => {
  const dispatch = useDispatch();

  const { isInitialized } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <div className="w-9 h-9 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />

        <p className="text-sm font-medium text-slate-600">
          Loading EventSphere...
        </p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/expos" element={<Expos />} />

          <Route
            path="/expos/:eventId"
            element={<ExpoDetails />}
          />

          <Route
            path="/exhibitors"
            element={<Exhibitors />}
          />

          <Route path="/schedule" element={<Schedule />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Authentication Routes */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/forgot-password"
              element={<ForgotPassword />}
            />

            <Route
              path="/reset-password/:token"
              element={<ResetPassword />}
            />
          </Route>
        </Route>

        {/* Admin Protected Routes */}
        <Route
          element={
            <ProtectedRoutes allowedRoles={["admin"]} />
          }
        >
          <Route path="/admin" element={<AdminLayout />}>

            <Route
              path="dashboard"
              element={<AdminDashboard />}
            />

            <Route
              path="expos"
              element={<AdminExpos />}
            />

            <Route
              path="exhibitors"
              element={<AdminExhibitors />}
            />

            <Route
              path="schedule"
              element={<AdminSchedule />}
            />

           

            <Route
              path="booths"
              element={<AdminBooths />}
            />

          </Route>
        </Route>

        {/* Exhibitor Protected Routes */}
        <Route
          element={
            <ProtectedRoutes allowedRoles={["exhibitor"]} />
          }
        >
          <Route
            path="/exhibitor"
            element={<ExhibitorLayout />}
          >

            <Route
              path="dashboard"
              element={<ExhibitorDashboard />}
            />

            <Route
              path="my-applications"
              element={<MyApplications />}
            />

            <Route
              path="booth-reservation"
              element={<BoothReservation />}
            />

          

            {/* Exhibitor Profile */}
            <Route
              path="profile"
              element={<ExhibitorProfile />}
            />

          </Route>
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<PageNotFound />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
