import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../../api/axios";
import { toast } from "react-toastify";

import {
  Calendar,
  MapPin,
  Tag,
  PlusCircle,
  Edit3,
  Trash2,
  Upload,
  X,
  Loader2,
  FileText,
  CalendarDays,
  Sparkles,
} from "lucide-react";

const initialEventData = {
  title: "",
  description: "",
  theme: "",
  location: "",
  startDate: "",
  endDate: "",
  status: "draft",
};

const AdminExpos = () => {
  const { user } = useSelector((state) => state.auth);
  const displayName = user?.username || user?.name || "Admin";

  const [eventData, setEventData] = useState(initialEventData);
  const [imageFile, setImageFile] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const fetchEvents = async () => {
    try {
      const response = await api.get("/admin/events");
      setEvents(response.data.events || []);
    } catch (error) {
      console.error("Fetch expos error:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch expos"
      );
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPG, PNG, and WebP images are allowed");
        e.target.value = "";
        setImageFile(null);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be 5 MB or less");
        e.target.value = "";
        setImageFile(null);
        return;
      }
    }

    setImageFile(file);
  };

  const resetForm = () => {
    setEventData({ ...initialEventData });
    setImageFile(null);

    const fileInput = document.getElementById("image");
    if (fileInput) fileInput.value = "";

    setEditingId(null);
  };

  const validateDates = () => {
    if (!eventData.startDate || !eventData.endDate) {
      toast.error("Please select both dates");
      return false;
    }

    if (
      new Date(eventData.endDate) <
      new Date(eventData.startDate)
    ) {
      toast.error("End date cannot be before start date");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateDates()) return;

    const formData = new FormData();

    Object.entries(eventData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      setLoading(true);

      let response;

      if (editingId) {
        response = await api.patch(
          `/admin/events/${editingId}`,
          formData
        );
      } else {
        response = await api.post("/admin/events", formData);
      }

      toast.success(
        response.data.message ||
          (editingId
            ? "Expo updated successfully"
            : "Expo created successfully")
      );

      resetForm();
      await fetchEvents();
    } catch (error) {
      console.error("Save expo error:", error);

      toast.error(
        error.response?.data?.message || "Failed to save expo"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    setEditingId(event._id);

    setEventData({
      title: event.title || "",
      description: event.description || "",
      theme: event.theme || "",
      location: event.location || "",
      startDate: event.startDate
        ? event.startDate.slice(0, 10)
        : "",
      endDate: event.endDate
        ? event.endDate.slice(0, 10)
        : "",
      status: event.status || "draft",
    });

    setImageFile(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expo?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/admin/events/${id}`);

      toast.success("Expo deleted successfully");

      if (editingId === id) {
        resetForm();
      }

      await fetchEvents();
    } catch (error) {
      console.error("Delete expo error:", error);

      toast.error(
        error.response?.data?.message || "Failed to delete expo"
      );
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "published":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "draft":
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <p className="text-sm font-semibold text-indigo-600 mb-1">
            Welcome back, {displayName}!
          </p>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {editingId ? "Update Expo" : "Create New Expo"}
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Create, update, and organize your trade shows and exhibitions.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-medium bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl border border-indigo-100 w-fit">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          <span>EventSphere Admin Portal</span>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <CalendarDays className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              {editingId ? "Edit Existing Expo" : "New Expo Details"}
            </h2>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              disabled={loading}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-2">
                Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Enter expo title"
                value={eventData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            {/* Theme */}
            <div>
              <label htmlFor="theme" className="block text-sm font-semibold text-slate-700 mb-2">
                Theme <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="theme"
                name="theme"
                placeholder="Enter expo theme"
                value={eventData.theme}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-semibold text-slate-700 mb-2">
                Location <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="Enter expo location"
                value={eventData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-slate-700 mb-2">
                Status <span className="text-rose-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={eventData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-semibold text-slate-700 mb-2">
                Start Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={eventData.startDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            {/* End Date */}
            <div>
              <label htmlFor="endDate" className="block text-sm font-semibold text-slate-700 mb-2">
                End Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                min={eventData.startDate || undefined}
                value={eventData.endDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Enter expo description"
              value={eventData.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-y"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="block text-sm font-semibold text-slate-700 mb-2">
              Upload Event Image
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="h-16 w-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <Upload className="h-7 w-7" />
              </div>
              <div className="flex-1 text-center sm:text-left w-full">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Allowed types: JPG, PNG, WebP (Max 5 MB).
                </p>
                {imageFile && (
                  <p className="text-xs font-medium text-indigo-600 mt-1 truncate">
                    Selected image: {imageFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-slate-100">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                Cancel Edit
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center space-x-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Please wait...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4" />
                  <span>{editingId ? "Update Expo" : "Create Expo"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <hr className="border-slate-200 my-8" />

      {/* Manage Expos Section */}
      <section className="space-y-6 events-list">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Manage Expos
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Overview and management of all trade shows.
            </p>
          </div>
          <span className="text-xs font-semibold bg-slate-200 text-slate-700 px-3 py-1 rounded-full">
            Total: {events.length}
          </span>
        </div>

        {fetching ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-3" />
            <p className="text-sm font-medium text-slate-600">
              Loading expos...
            </p>
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
            <div className="h-16 w-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
              <FileText className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No expos found.
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mt-1">
              Create your first exhibition using the form above to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {events.map((event) => (
              <article
                key={event._id}
                className="event-item bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group"
              >
                {/* Event Image */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  {event.image ? (
                    <img
                      src={`http://localhost:3000${event.image}`}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                      <Calendar className="h-10 w-10" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full border shadow-sm backdrop-blur-md bg-white/90 ${getStatusBadge(
                        event.status
                      )}`}
                    >
                      {event.status}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center space-x-1.5 text-xs font-medium text-indigo-600 mb-1">
                        <Tag className="h-3.5 w-3.5" />
                        <span>{event.theme}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {event.title}
                      </h3>
                    </div>

                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        <span>
                          {event.startDate?.slice(0, 10)} -{" "}
                          {event.endDate?.slice(0, 10)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleEdit(event)}
                      disabled={loading}
                      className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(event._id)}
                      disabled={loading}
                      className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminExpos;