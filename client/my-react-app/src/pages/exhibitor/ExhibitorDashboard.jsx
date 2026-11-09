
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  CalendarDays,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Store,
  ArrowRight,
  MapPin,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Plus,
  UserRound,
} from "lucide-react";

import { useSelector } from "react-redux";
import api from "../../../api/axios";

// Date formatter
const formatDate = (date) => {
  if (!date) return "Date not available";

  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Status styles
const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "rejected":
      return "bg-rose-50 text-rose-700 border-rose-200";

    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
};

const ExhibitorDashboard = () => {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalApplications: 0,
      approvedApplications: 0,
      pendingApplications: 0,
      rejectedApplications: 0,
      reservedBooths: 0,
    },
    recentApplications: [],
    upcomingExpos: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const displayName =
    user?.username ||
    user?.name ||
    user?.fullName ||
    "Exhibitor";

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/exhibitor/dashboard/stats"
      );

      if (response.data.success) {
        setDashboardData({
          stats: response.data.stats || {},
          recentApplications:
            response.data.recentApplications || [],
          upcomingExpos: response.data.upcomingExpos || [],
        });
      }
    } catch (err) {
      console.error("Dashboard API Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = dashboardData.stats;

  const statCards = [
    {
      title: "Total Applications",
      value: stats.totalApplications ?? 0,
      icon: FileText,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Approved",
      value: stats.approvedApplications ?? 0,
      icon: CheckCircle,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Pending",
      value: stats.pendingApplications ?? 0,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Rejected",
      value: stats.rejectedApplications ?? 0,
      icon: XCircle,
      color: "bg-rose-50 text-rose-600",
    },
    {
      title: "Reserved Booths",
      value: stats.reservedBooths ?? 0,
      icon: Store,
      color: "bg-violet-50 text-violet-600",
    },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
        <p className="text-sm font-medium text-slate-500">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <div className="mb-4 rounded-full bg-rose-50 p-4">
          <AlertCircle className="h-8 w-8 text-rose-500" />
        </div>

        <h2 className="text-lg font-bold text-slate-800">
          Unable to load dashboard
        </h2>

        <p className="mt-2 max-w-md text-sm text-slate-500">
          {error}
        </p>

        <button
          onClick={fetchDashboardData}
          className="mt-5 flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-7">

      {/* Welcome Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 p-6 text-white shadow-lg sm:p-8">

        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">

          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-indigo-100">
              <Sparkles className="h-4 w-4" />
              Exhibitor Workspace
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl">
              Welcome back, {displayName}! 
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100">
              Manage your expo applications, reserve booths,
              and keep track of your upcoming events.
            </p>

            <button
              onClick={() => navigate("/expos")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 shadow-md transition hover:bg-indigo-50"
            >
              <Plus className="h-4 w-4" />
              Explore Expos
            </button>
          </div>

          <div className="hidden h-32 w-32 items-center justify-center rounded-3xl border border-white/20 bg-white/10 sm:flex">
            <Store className="h-16 w-16 text-white" />
          </div>

        </div>

        <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-28 right-40 h-64 w-64 rounded-full bg-white/5" />
      </section>

      {/* Statistics */}
      <section>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Dashboard Overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Your application and booth statistics
            </p>
          </div>

          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className={`rounded-xl p-3 ${card.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <h3 className="mt-5 text-3xl font-bold text-slate-800">
                  {card.value}
                </h3>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  {card.title}
                </p>
              </div>
            );
          })}

        </div>
      </section>

      {/* Recent Applications */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Recent Applications
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Track your latest expo applications
            </p>
          </div>

          <button
            onClick={() => navigate("/exhibitor/my-applications")}
            className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {dashboardData.recentApplications.length === 0 ? (
          <div className="p-10 text-center">
            <FileText className="mx-auto h-10 w-10 text-slate-300" />

            <h3 className="mt-3 font-semibold text-slate-700">
              No applications yet
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Apply for an expo to get started.
            </p>

            <button
              onClick={() => navigate("/expos")}
              className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Browse Expos
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">
                    Expo
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Applied Date
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Booth
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {dashboardData.recentApplications.map(
                  (application) => {
                    const event = application.event;
                    const booth = application.booth;

                    return (
                      <tr
                        key={application._id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-800">
                            {event?.title || "Expo unavailable"}
                          </p>

                          <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                            <MapPin className="h-3 w-3" />
                            {event?.location || "Location unavailable"}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {formatDate(application.createdAt)}
                        </td>

                        <td className="px-5 py-4 text-sm font-medium text-slate-700">
                          {booth?.boothNumber || "Not Assigned"}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(application.status)}`}
                          >
                            {application.status}
                          </span>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}

      </section>

      {/* Upcoming Expos */}
      <section>
        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-800">
            Upcoming Expos
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your approved and upcoming expo events
          </p>
        </div>

        {dashboardData.upcomingExpos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <CalendarDays className="mx-auto h-10 w-10 text-slate-300" />

            <h3 className="mt-3 font-semibold text-slate-700">
              No upcoming expos
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Your upcoming registered events will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {dashboardData.upcomingExpos.map((expo) => (
              <div
                key={expo._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {expo.image ? (
                  <img
                    src={
                      expo.image.startsWith("http")
                        ? expo.image
                        : `http://localhost:5000${expo.image}`
                    }
                    alt={expo.title}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center bg-gradient-to-br from-indigo-100 to-violet-100">
                    <CalendarDays className="h-14 w-14 text-indigo-400" />
                  </div>
                )}

                <div className="p-5">
                  <h3 className="font-bold text-slate-800">
                    {expo.title}
                  </h3>

                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <MapPin className="h-4 w-4" />
                    {expo.location}
                  </p>

                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <CalendarDays className="h-4 w-4" />
                    {formatDate(expo.startDate)}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(expo.applicationStatus)}`}>
                      {expo.applicationStatus}
                    </span>

                    <button
                      onClick={() =>
                        navigate("/exhibitor/my-applications")
                      }
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-bold text-slate-800">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Quickly access your exhibitor workspace
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

          <button
            onClick={() => navigate("/expos")}
            className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
          >
            <CalendarDays className="h-5 w-5 text-indigo-600" />
            <span className="text-sm font-semibold text-slate-700">
              Browse Expos
            </span>
          </button>

          <button
            onClick={() => navigate("/exhibitor/my-applications")}
            className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
          >
            <FileText className="h-5 w-5 text-indigo-600" />
            <span className="text-sm font-semibold text-slate-700">
              My Applications
            </span>
          </button>

          <button
            onClick={() => navigate("/exhibitor/booth-reservation")}
            className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
          >
            <Store className="h-5 w-5 text-indigo-600" />
            <span className="text-sm font-semibold text-slate-700">
              Reserve Booth
            </span>
          </button>

          <button
            onClick={() => navigate("/exhibitor/profile")}
            className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
          >
            <UserRound className="h-5 w-5 text-indigo-600" />
            <span className="text-sm font-semibold text-slate-700">
              Edit Profile
            </span>
          </button>

        </div>
      </section>

    </div>
  );
};

export default ExhibitorDashboard;
