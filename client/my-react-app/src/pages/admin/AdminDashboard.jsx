
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  CalendarDays,
  Users,
  FileCheck2,
  LayoutGrid,
  Clock3,
  TrendingUp,
  RefreshCw,
  MapPin,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Building2,
  CalendarRange,
} from "lucide-react";

import api from "../../../api/axios"

// Format dates safely
const formatDate = (date) => {
  if (!date) return "Date unavailable";

  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date) => {
  if (!date) return "Time unavailable";

  return new Date(date).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
};

// Status badge
const StatusBadge = ({ status }) => {
  const styles = {
    published: "bg-green-100 text-green-700",
    draft: "bg-amber-100 text-amber-700",
    cancelled: "bg-red-100 text-red-700",
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    available: "bg-green-100 text-green-700",
    reserved: "bg-amber-100 text-amber-700",
    occupied: "bg-indigo-100 text-indigo-700",
  };

  const normalizedStatus = status?.toLowerCase() || "unknown";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
        styles[normalizedStatus] || "bg-slate-100 text-slate-600"
      }`}
    >
      {normalizedStatus}
    </span>
  );
};

// Statistics card
const StatsCard = ({ title, value, subtitle, icon: Icon, color }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h2 className="mt-3 text-3xl font-bold text-slate-800">
            {value ?? 0}
          </h2>
        </div>

        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={25} />
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">{subtitle}</p>
    </div>
  );
};

// Section heading
const SectionHeading = ({ title, link, to }) => {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>

      {link && (
        <Link
          to={to}
          className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
        >
          {link}
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const user = useSelector((state) => state.auth?.user);

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get("/admin/dashboard/stats");

      if (response.data.success) {
        setDashboard(response.data);
      } else {
        setError("Unable to load dashboard data.");
      }
    } catch (err) {
      console.error("Dashboard API Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load dashboard. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const stats = dashboard?.stats;

  const events = stats?.events || {};
  const exhibitors = stats?.exhibitors || {};
  const applications = stats?.applications || {};
  const booths = stats?.booths || {};
  const sessions = stats?.sessions || {};

  const recentEvents = dashboard?.recentEvents || [];
  const recentApplications = dashboard?.recentApplications || [];
  const upcomingSessions = dashboard?.upcomingSessions || [];

  const adminName =
    user?.username || user?.name || "Admin";

  // Initial loading
  if (loading) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-slate-200" />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-2xl bg-slate-200"
            />
          ))}
        </div>

        <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    );
  }

  // Error state
  if (error && !dashboard) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
        <AlertCircle size={45} className="mb-4 text-red-500" />

        <h2 className="text-xl font-bold text-slate-800">
          Something went wrong
        </h2>

        <p className="mt-2 max-w-md text-sm text-slate-500">
          {error}
        </p>

        <button
          onClick={() => fetchDashboard()}
          className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-7 p-4 sm:p-6">

      {/* Dashboard Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-indigo-600">
            Welcome back, {adminName}!
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">
            Dashboard Overview
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Here's what's happening with your EventSphere platform.
          </p>
        </div>

        <button
          onClick={() => fetchDashboard(true)}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={refreshing ? "animate-spin" : ""}
          />
          {refreshing ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error} Showing the last successfully loaded data.
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

        <StatsCard
          title="Total Expos"
          value={events.total}
          subtitle={`${events.published || 0} published · ${events.draft || 0} drafts`}
          icon={CalendarDays}
          color="bg-indigo-100 text-indigo-600"
        />

        <StatsCard
          title="Total Exhibitors"
          value={exhibitors.total}
          subtitle="Registered exhibitor accounts"
          icon={Users}
          color="bg-teal-100 text-teal-600"
        />

        <StatsCard
          title="Total Applications"
          value={applications.total}
          subtitle={`${applications.pending || 0} applications pending`}
          icon={FileCheck2}
          color="bg-amber-100 text-amber-600"
        />

        <StatsCard
          title="Total Booths"
          value={booths.total}
          subtitle={`${booths.available || 0} booths currently available`}
          icon={LayoutGrid}
          color="bg-violet-100 text-violet-600"
        />

        <StatsCard
          title="Upcoming Sessions"
          value={sessions.upcoming}
          subtitle={`${sessions.total || 0} total scheduled sessions`}
          icon={Clock3}
          color="bg-sky-100 text-sky-600"
        />

        <StatsCard
          title="Occupied & Reserved"
          value={booths.allocated}
          subtitle={`${booths.occupancyPercentage || 0}% booth allocation`}
          icon={TrendingUp}
          color="bg-rose-100 text-rose-600"
        />

      </div>

      {/* Event and Application Analytics */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* Expo Status */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <SectionHeading title="Expo Status Overview" />

          <div className="space-y-5">
            {[
              {
                label: "Published",
                value: events.published || 0,
                color: "bg-green-500",
              },
              {
                label: "Draft",
                value: events.draft || 0,
                color: "bg-amber-500",
              },
              {
                label: "Cancelled",
                value: events.cancelled || 0,
                color: "bg-red-500",
              },
            ].map((item) => {
              const percentage =
                events.total > 0
                  ? (item.value / events.total) * 100
                  : 0;

              return (
                <div key={item.label}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-slate-600">
                      {item.label}
                    </span>

                    <span className="font-bold text-slate-800">
                      {item.value}
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Application Status */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <SectionHeading
            title="Application Status"
            link="View Applications"
            to="/admin/exhibitors"
          />

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-amber-50 p-4 text-center">
              <Clock3 className="mx-auto text-amber-600" size={23} />
              <h3 className="mt-3 text-2xl font-bold text-amber-700">
                {applications.pending || 0}
              </h3>
              <p className="mt-1 text-xs font-medium text-amber-700">
                Pending
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-4 text-center">
              <CheckCircle2 className="mx-auto text-green-600" size={23} />
              <h3 className="mt-3 text-2xl font-bold text-green-700">
                {applications.approved || 0}
              </h3>
              <p className="mt-1 text-xs font-medium text-green-700">
                Approved
              </p>
            </div>

            <div className="rounded-xl bg-red-50 p-4 text-center">
              <AlertCircle className="mx-auto text-red-600" size={23} />
              <h3 className="mt-3 text-2xl font-bold text-red-700">
                {applications.rejected || 0}
              </h3>
              <p className="mt-1 text-xs font-medium text-red-700">
                Rejected
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-sm text-slate-500">
              Total applications
            </span>
            <span className="text-lg font-bold text-slate-800">
              {applications.total || 0}
            </span>
          </div>
        </div>

      </div>

      {/* Booth Allocation */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SectionHeading
          title="Booth Allocation Overview"
          link="Manage Booths"
          to="/admin/booths"
        />

        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-3xl font-bold text-slate-800">
              {booths.occupancyPercentage || 0}%
            </h3>
            <p className="text-sm text-slate-500">
              Booth allocation rate
            </p>
          </div>

          <p className="text-sm text-slate-500">
            {booths.allocated || 0} of {booths.total || 0} booths allocated
          </p>
        </div>

        <div className="flex h-4 overflow-hidden rounded-full bg-slate-100">
          {booths.total > 0 && (
            <>
              <div
                className="bg-amber-500"
                style={{
                  width: `${(booths.reserved / booths.total) * 100}%`,
                }}
              />

              <div
                className="bg-indigo-600"
                style={{
                  width: `${(booths.occupied / booths.total) * 100}%`,
                }}
              />
            </>
          )}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              label: "Available",
              value: booths.available || 0,
              color: "bg-green-500",
            },
            {
              label: "Reserved",
              value: booths.reserved || 0,
              color: "bg-amber-500",
            },
            {
              label: "Occupied",
              value: booths.occupied || 0,
              color: "bg-indigo-600",
            },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className={`h-3 w-3 rounded-full ${item.color}`} />
              <span className="text-sm text-slate-500">
                {item.label}
              </span>
              <span className="ml-auto font-bold text-slate-800">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Events */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SectionHeading
          title="Recent Expos"
          link="View All Expos"
          to="/admin/expos"
        />

        {recentEvents.length === 0 ? (
          <div className="py-10 text-center">
            <CalendarRange className="mx-auto text-slate-300" size={38} />
            <p className="mt-3 text-sm text-slate-500">
              No expos have been created yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase text-slate-400">
                  <th className="px-3 py-3">Expo</th>
                  <th className="px-3 py-3">Location</th>
                  <th className="px-3 py-3">Start Date</th>
                  <th className="px-3 py-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {recentEvents.map((event) => (
                  <tr
                    key={event._id}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-3 py-4">
                      <p className="font-semibold text-slate-800">
                        {event.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {event.theme || "General Expo"}
                      </p>
                    </td>

                    <td className="px-3 py-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {event.location}
                      </span>
                    </td>

                    <td className="px-3 py-4 text-sm text-slate-600">
                      {formatDate(event.startDate)}
                    </td>

                    <td className="px-3 py-4">
                      <StatusBadge status={event.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Applications */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SectionHeading
          title="Recent Exhibitor Applications"
          link="Manage Applications"
          to="/admin/exhibitors"
        />

        {recentApplications.length === 0 ? (
          <div className="py-10 text-center">
            <Building2 className="mx-auto text-slate-300" size={38} />
            <p className="mt-3 text-sm text-slate-500">
              No exhibitor applications found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase text-slate-400">
                  <th className="px-3 py-3">Company</th>
                  <th className="px-3 py-3">Exhibitor</th>
                  <th className="px-3 py-3">Expo</th>
                  <th className="px-3 py-3">Applied</th>
                  <th className="px-3 py-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {recentApplications.map((application) => (
                  <tr
                    key={application._id}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-3 py-4 font-semibold text-slate-800">
                      {application.companyName}
                    </td>

                    <td className="px-3 py-4">
                      <p className="text-sm font-medium text-slate-700">
                        {application.exhibitor?.username || "Unknown"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {application.exhibitor?.email || ""}
                      </p>
                    </td>

                    <td className="px-3 py-4 text-sm text-slate-600">
                      {application.event?.title || "Unknown Expo"}
                    </td>

                    <td className="px-3 py-4 text-sm text-slate-600">
                      {formatDate(application.createdAt)}
                    </td>

                    <td className="px-3 py-4">
                      <StatusBadge status={application.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upcoming Sessions */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SectionHeading
          title="Upcoming Sessions"
          link="Manage Schedule"
          to="/admin/schedule"
        />

        {upcomingSessions.length === 0 ? (
          <div className="py-10 text-center">
            <Clock3 className="mx-auto text-slate-300" size={38} />
            <p className="mt-3 text-sm text-slate-500">
              No upcoming sessions scheduled.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <div
                key={session._id}
                className="flex flex-col gap-3 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-slate-800">
                    {session.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {session.event?.title || "Unknown Expo"}
                  </p>

                  {session.description && (
                    <p className="mt-1 text-xs text-slate-400">
                      {session.description}
                    </p>
                  )}
                </div>

                <div className="text-sm text-indigo-600 sm:text-right">
                  <p className="font-semibold">
                    {formatDateTime(session.startTime)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Until {formatDateTime(session.endTime)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-5 text-lg font-bold text-slate-800">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Manage Expos",
              description: "Create and manage events",
              icon: CalendarDays,
              to: "/admin/expos",
              color: "text-indigo-600 bg-indigo-100",
            },
            {
              title: "Manage Exhibitors",
              description: "Review applications",
              icon: Users,
              to: "/admin/exhibitors",
              color: "text-teal-600 bg-teal-100",
            },
            {
              title: "Manage Booths",
              description: "Control booth allocation",
              icon: LayoutGrid,
              to: "/admin/booths",
              color: "text-violet-600 bg-violet-100",
            },
            {
              title: "Manage Schedule",
              description: "Organize event sessions",
              icon: Clock3,
              to: "/admin/schedule",
              color: "text-amber-600 bg-amber-100",
            },
          ].map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                to={action.to}
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
              >
                <div className={`rounded-xl p-3 ${action.color}`}>
                  <Icon size={24} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-800">
                    {action.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {action.description}
                  </p>
                </div>

                <ArrowRight
                  size={18}
                  className="ml-auto text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600"
                />
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
