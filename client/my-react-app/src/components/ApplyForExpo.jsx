
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api/axios"
import { toast } from "react-toastify";
import { Building2, FileText, ArrowLeft, Send } from "lucide-react";

const ApplyForExpo = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    description: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.companyName.trim()) {
      toast.error("Company Name is required");
      return;
    }

    if (submitting) return;

    try {
      setSubmitting(true);

      const response = await api.post(
        `/exhibitor/${eventId}/applications`,
        {
          companyName: formData.companyName.trim(),
          description: formData.description.trim(),
        }
      );

      toast.success(
        response.data.message ||
        "Application submitted successfully!"
      );

      setFormData({
        companyName: "",
        description: "",
      });

      navigate("/exhibitor/dashboard");

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to submit application"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

      <Link
        to={`/expos/${eventId}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Expo Details
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">

        <div>
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            Exhibitor Application
          </span>

          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Apply for Expo
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Submit your company details to request participation in this expo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Company Name */}
          <div>
            <label
              htmlFor="companyName"
              className="block text-xs font-semibold text-slate-700 uppercase mb-2"
            >
              Company Name *
            </label>

            <div className="relative">
              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter your company name"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-xs font-semibold text-slate-700 uppercase mb-2"
            >
              Company Description
            </label>

            <div className="relative">
              <FileText className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />

              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your company, products and services..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />

              {submitting
                ? "Submitting..."
                : "Submit Application"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ApplyForExpo;
