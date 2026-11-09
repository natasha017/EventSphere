
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../../api/axios"
import { toast } from "react-toastify";

import {
  Calendar,
  MapPin,
  Tag,
  ArrowLeft,
  Send,
  Info,
  CheckCircle2,
  X,
  Building2,
  FileText,
} from "lucide-react";

const ExpoDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  // Expo States
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Application Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Application Form State
  const [formData, setFormData] = useState({
    companyName: "",
    description: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // Fetch Expo Details
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/events/${eventId}`);

        setEvent(response.data.event);
      } catch (error) {
        console.error("Expo Details Error:", error);

        toast.error(
          error.response?.data?.message ||
            "Failed to load expo details"
        );

        navigate("/expos");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, navigate]);

  // Get Image URL
  const getImageSrc = (imagePath) => {
    if (!imagePath) {
      return "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop";
    }

    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    const baseURL = api.defaults.baseURL || "";
    const serverUrl = baseURL.replace(/\/api\/?$/, "");

    return `${serverUrl}/${imagePath.replace(/^\//, "")}`;
  };

  // Handle Application Inputs
  const handleApplicationChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit Application
  const handleApplicationSubmit = async (e) => {
    e.preventDefault();

    if (!formData.companyName.trim()) {
      toast.error("Company Name is required");
      return;
    }

    if (submitting) return;

    try {
      setSubmitting(true);
const response = await api.post(
  `/exhibitor/${event._id}/applications`,
  {
    companyName: formData.companyName.trim(),
    description: formData.description.trim(),
  }
);
      toast.success(
        response.data?.message ||
          "Application submitted successfully!"
      );

      // Reset Form
      setFormData({
        companyName: "",
        description: "",
      });

      // Close Modal
      setIsApplyModalOpen(false);

    } catch (error) {
      console.error("Application Submission Error:", error);
      console.log("Status:", error.response?.status);
      console.log("Response:", error.response?.data);

      toast.error(
        error.response?.data?.message ||
          "Failed to submit application"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />

        <p className="text-sm font-medium text-slate-500">
          Loading expo details...
        </p>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">

      {/* Back Button */}
      <Link
        to="/expos"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Expos</span>
      </Link>

      {/* Main Expo Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Banner Image */}
        <div className="relative h-72 bg-slate-900 sm:h-96">

          <img
            src={getImageSrc(event.image)}
            alt={event.title}
            className="h-full w-full object-cover opacity-90"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop";
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 space-y-2 text-white">

            {event.theme && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                <Tag className="h-3.5 w-3.5" />
                {event.theme}
              </span>
            )}

            <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl">
              {event.title}
            </h1>

          </div>
        </div>

        {/* Expo Information */}
        <div className="space-y-8 p-6 sm:p-8">

          {/* Details Grid */}
          <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:grid-cols-2">

            {/* Location */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <MapPin className="h-5 w-5" />
              </div>

              <div>
                <span className="block text-xs font-medium text-slate-400">
                  Location
                </span>

                <span className="text-sm font-semibold text-slate-800">
                  {event.location || "To Be Announced"}
                </span>
              </div>
            </div>

            {/* Event Dates */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <Calendar className="h-5 w-5" />
              </div>

              <div>
                <span className="block text-xs font-medium text-slate-400">
                  Event Dates
                </span>

                <span className="text-sm font-semibold text-slate-800">
                  {new Date(event.startDate).toLocaleDateString()}
                  {" – "}
                  {new Date(event.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>

          </div>

          {/* Event Description */}
          <div>
            <h3 className="mb-3 text-lg font-bold text-slate-900">
              About This Expo
            </h3>

            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
              {event.description}
            </p>
          </div>

          {/* Apply Section */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row">

            {/* Status */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />

              <span>
                Status:{" "}
                <strong className="capitalize text-slate-800">
                  {event.status}
                </strong>
              </span>
            </div>

            {/* Role Based Buttons */}

            {(user?.role || "").trim().toLowerCase() === "exhibitor" ? (

              <button
                type="button"
                onClick={() => setIsApplyModalOpen(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700 sm:w-auto"
              >
                <Send className="h-4 w-4" />
                Apply Now
              </button>

            ) : user ? (

              <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-medium text-slate-600">
                <Info className="h-4 w-4 text-indigo-600" />

                <span>
                  Logged in as{" "}
                  <strong className="capitalize">
                    {user.role}
                  </strong>.
                  Only exhibitors can apply.
                </span>
              </div>

            ) : (

              <Link
                to="/login"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-700 sm:w-auto"
              >
                Login to Apply
              </Link>

            )}

          </div>

        </div>
      </div>

      {/* ================================== */}
      {/* EXHIBITOR APPLICATION MODAL */}
      {/* ================================== */}

      {isApplyModalOpen && (

        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => {
            if (!submitting) {
              setIsApplyModalOpen(false);
            }
          }}
        >

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="application-title"
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div>
                <h2
                  id="application-title"
                  className="text-xl font-bold text-slate-900"
                >
                  Exhibitor Application
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Apply for {event.title}
                </p>
              </div>

              <button
                type="button"
                disabled={submitting}
                onClick={() => setIsApplyModalOpen(false)}
                className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 disabled:opacity-50"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* Application Form */}
            <form
              onSubmit={handleApplicationSubmit}
              className="space-y-5 p-6"
            >

              {/* Company Name */}
              <div>
                <label
                  htmlFor="companyName"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Company Name *
                </label>

                <div className="relative">

                  <Building2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleApplicationChange}
                    placeholder="Enter your company name"
                    required
                    disabled={submitting}
                    className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 disabled:bg-slate-100"
                  />

                </div>
              </div>

              {/* Company Description */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Company Description
                </label>

                <div className="relative">

                  <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />

                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleApplicationChange}
                    placeholder="Describe your company, products and services..."
                    disabled={submitting}
                    className="w-full resize-none rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 disabled:bg-slate-100"
                  />

                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setIsApplyModalOpen(false)}
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />

                  <span>
                    {submitting
                      ? "Submitting..."
                      : "Submit Application"}
                  </span>
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default ExpoDetails;
