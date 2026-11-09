
import { useEffect, useState } from "react";
import {
  CalendarDays,
  MapPin,
  Building2,
  Layers,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  FileText,
} from "lucide-react";
import api from "../../../api/axios";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/exhibitor/my-applications");

      setApplications(response.data.applications || []);
    } catch (err) {
      console.error("Applications Fetch Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load your applications. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return {
          className:
            "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <CheckCircle size={15} />,
          label: "Approved",
        };

      case "rejected":
        return {
          className: "bg-red-50 text-red-700 border-red-200",
          icon: <XCircle size={15} />,
          label: "Rejected",
        };

      default:
        return {
          className:
            "bg-amber-50 text-amber-700 border-amber-200",
          icon: <Clock size={15} />,
          label: "Pending",
        };
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-9 h-9 animate-spin text-indigo-600" />
        <p className="text-slate-500 font-medium">
          Loading your applications...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-3" />

        <h2 className="text-xl font-bold text-slate-800">
          Something went wrong
        </h2>

        <p className="text-slate-500 mt-2 mb-5">{error}</p>

        <button
          onClick={fetchApplications}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              My Applications
            </h1>

            <p className="text-slate-500 mt-2">
              Track your event applications and booth assignments.
            </p>
          </div>

          <button
            onClick={fetchApplications}
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-100 transition"
          >
            Refresh
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-slate-500 font-medium">
              Total Applications
            </p>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">
              {applications.length}
            </h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-slate-500 font-medium">
              Approved
            </p>
            <h2 className="text-3xl font-bold text-emerald-600 mt-2">
              {applications.filter((a) => a.status === "approved").length}
            </h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-slate-500 font-medium">
              Pending
            </p>
            <h2 className="text-3xl font-bold text-amber-600 mt-2">
              {applications.filter((a) => a.status === "pending").length}
            </h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-slate-500 font-medium">
              Rejected
            </p>
            <h2 className="text-3xl font-bold text-red-600 mt-2">
              {applications.filter((a) => a.status === "rejected").length}
            </h2>
          </div>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <FileText className="w-14 h-14 text-slate-300 mx-auto mb-4" />

            <h2 className="text-xl font-bold text-slate-800">
              No Applications Found
            </h2>

            <p className="text-slate-500 mt-2">
              You have not applied for any event yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {applications.map((application) => {
              const status = getStatusStyle(application.status);
              const event =
                application.event &&
                typeof application.event === "object"
                  ? application.event
                  : null;

              const booth =
                application.booth &&
                typeof application.booth === "object"
                  ? application.booth
                  : null;

              return (
                <div
                  key={application._id}
                  className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-5 sm:p-6 border-b border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-wider font-bold text-indigo-600 mb-2">
                          Event Application
                        </p>

                        <h2 className="text-xl font-bold text-slate-900">
                          {event?.title || "Event Details Unavailable"}
                        </h2>

                        <p className="text-sm text-slate-500 mt-2">
                          Application ID: {application._id}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold capitalize w-fit ${status.className}`}
                      >
                        {status.icon}
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                          <MapPin size={18} />
                        </div>

                        <div>
                          <p className="text-xs text-slate-400 font-semibold uppercase">
                            Location
                          </p>
                          <p className="text-sm font-semibold text-slate-700 mt-1">
                            {event?.location || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                          <CalendarDays size={18} />
                        </div>

                        <div>
                          <p className="text-xs text-slate-400 font-semibold uppercase">
                            Event Dates
                          </p>
                          <p className="text-sm font-semibold text-slate-700 mt-1">
                            {formatDate(event?.startDate)}
                            {" - "}
                            {formatDate(event?.endDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                          <Building2 size={18} />
                        </div>

                        <div>
                          <p className="text-xs text-slate-400 font-semibold uppercase">
                            Company
                          </p>
                          <p className="text-sm font-semibold text-slate-700 mt-1">
                            {application.companyName || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                          <Clock size={18} />
                        </div>

                        <div>
                          <p className="text-xs text-slate-400 font-semibold uppercase">
                            Applied On
                          </p>
                          <p className="text-sm font-semibold text-slate-700 mt-1">
                            {formatDate(application.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Application Description */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Application Description
                      </p>

                      <p className="text-sm text-slate-600 leading-relaxed">
                        {application.description || "No description provided."}
                      </p>
                    </div>

                    {/* Booth Assignment */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3">
                        <Layers className="w-4 h-4 text-indigo-600" />
                        Assigned Booth
                      </span>

                      {booth?._id ? (
                        <div className="space-y-2">
                          <p className="text-indigo-600 font-bold text-xl">
                            Booth {booth.boothNumber || "N/A"}
                          </p>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-slate-400">
                                Booth Size
                              </p>
                              <p className="text-sm font-semibold text-slate-700 capitalize mt-1">
                                {booth.size || "N/A"}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-slate-400">
                                Booth Price
                              </p>
                              <p className="text-sm font-semibold text-slate-700 mt-1">
                                {Number(booth.price || 0).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                            {booth.status || "Reserved"}
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="inline-flex px-3 py-1.5 rounded-lg text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            Not Assigned
                          </span>

                          {application.status === "approved" && (
                            <p className="text-xs text-slate-500 mt-2">
                              Your application is approved. You can reserve an available booth from the Booth Reservation page.
                            </p>
                          )}

                          {application.status === "pending" && (
                            <p className="text-xs text-slate-500 mt-2">
                              Booth reservation will be available after approval.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 sm:px-6 py-4 bg-slate-50 border-t border-slate-100">
                    <p className="text-xs text-slate-500">
                      Last updated: {formatDate(application.updatedAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
