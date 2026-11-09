
import { useEffect, useState } from "react";
import {
  Store,
  MapPin,
  CalendarDays,
  Layers,
  CheckCircle,
  AlertCircle,
  Loader2,
  Building2,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../../../api/axios";

const BoothReservation = () => {
  const [applications, setApplications] = useState([]);
  const [booths, setBooths] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [loading, setLoading] = useState(true);
  const [boothsLoading, setBoothsLoading] = useState(false);
  const [reserving, setReserving] = useState("");
  const [error, setError] = useState("");

  // Fetch approved applications
  const fetchApplications = async () => {
    try {
      setError("");

      const response = await api.get("/exhibitor/my-applications");

      const approved = (response.data.applications || []).filter(
        (application) =>
          application.status === "approved" && application.event
      );

      setApplications(approved);

      setSelectedEvent((previous) => {
        const exists = approved.some(
          (application) => application.event._id === previous
        );

        return exists ? previous : approved[0]?.event?._id || "";
      });
    } catch (err) {
      console.error("Applications Error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch approved applications."
      );
    }
  };

  // Fetch available booths
  const fetchBooths = async (eventId) => {
    if (!eventId) {
      setBooths([]);
      return;
    }

    try {
      setBoothsLoading(true);

      const response = await api.get(
        `/events/${eventId}/booths/available`
      );

      setBooths(response.data.booths || []);
    } catch (err) {
      console.error("Booths Error:", err);

      setBooths([]);

      toast.error(
        err.response?.data?.message ||
          "Failed to fetch available booths."
      );
    } finally {
      setBoothsLoading(false);
    }
  };

  // Initial loading
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await fetchApplications();
      setLoading(false);
    };

    initialize();
  }, []);

  // Load booths when event changes
  useEffect(() => {
    if (selectedEvent) {
      fetchBooths(selectedEvent);
    } else {
      setBooths([]);
    }
  }, [selectedEvent]);

  const selectedApplication = applications.find(
    (application) => application.event?._id === selectedEvent
  );

  const assignedBooth = selectedApplication?.booth;

  // Reserve booth
  const handleReserve = async (boothId) => {
    if (!selectedEvent || reserving) return;

    const confirmed = window.confirm(
      "Are you sure you want to reserve this booth?"
    );

    if (!confirmed) return;

    try {
      setReserving(boothId);

      const response = await api.post(
        `/events/${selectedEvent}/booths/${boothId}/reserve`
      );

      toast.success(
        response.data.message || "Booth reserved successfully!"
      );

      // Refresh application and booth information
      const applicationsResponse = await api.get(
        "/exhibitor/my-applications"
      );

      const approved = (
        applicationsResponse.data.applications || []
      ).filter(
        (application) =>
          application.status === "approved" && application.event
      );

      setApplications(approved);

      await fetchBooths(selectedEvent);
    } catch (err) {
      console.error("Reservation Error:", err);

      toast.error(
        err.response?.data?.message ||
          "Booth reservation failed."
      );

      await fetchBooths(selectedEvent);
    } finally {
      setReserving("");
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await fetchApplications();
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <p className="text-sm font-medium text-slate-500">
          Loading booth reservation...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-7">

      {/* Page Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-indigo-600">
            <Store size={18} />
            Exhibitor Portal
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Booth Reservation
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Select your approved event and reserve your preferred booth.
          </p>
        </div>

        <button
          onClick={refreshData}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* No Approved Applications */}
      {applications.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <AlertCircle size={30} />
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            No Approved Applications
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            You need an approved event application before you can reserve a booth.
          </p>
        </div>
      ) : (
        <>
          {/* Event Selection */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <CalendarDays size={22} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Select Your Event
                </h2>

                <p className="text-xs text-slate-500">
                  Only approved events are available.
                </p>
              </div>
            </div>

            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {applications.map((application) => (
                <option
                  key={application._id}
                  value={application.event._id}
                >
                  {application.event.title}
                  {application.booth ? " - Booth Reserved" : ""}
                </option>
              ))}
            </select>

            {selectedApplication?.event && (
              <div className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <MapPin className="text-indigo-500" size={19} />
                  <div>
                    <p className="text-xs text-slate-400">Location</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {selectedApplication.event.location || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CalendarDays className="text-indigo-500" size={19} />
                  <div>
                    <p className="text-xs text-slate-400">Start Date</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {selectedApplication.event.startDate
                        ? new Date(
                            selectedApplication.event.startDate
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Already Reserved */}
          {assignedBooth ? (
            <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
              <div className="bg-emerald-50 p-6 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
                  <CheckCircle size={30} />
                </div>

                <h2 className="text-xl font-bold text-emerald-800">
                  Booth Successfully Reserved!
                </h2>

                <p className="mt-2 text-sm text-emerald-700">
                  Your booth is assigned to this event.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Booth Number
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {assignedBooth.boothNumber || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Booth Size
                  </p>
                  <p className="mt-2 font-bold capitalize text-slate-900">
                    {assignedBooth.size || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Booth Price
                  </p>
                  <p className="mt-2 font-bold text-slate-900">
                    {Number(assignedBooth.price || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Available Booths Heading */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Available Booths
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Choose a booth that matches your business needs.
                  </p>
                </div>

                <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  {booths.length} Booths Available
                </span>
              </div>

              {/* Booth Loading */}
              {boothsLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="h-9 w-9 animate-spin text-indigo-600" />
                </div>
              ) : booths.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                  <Layers className="mx-auto mb-4 text-slate-300" size={42} />

                  <h3 className="font-bold text-slate-800">
                    No Booths Available
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    There are no available booths for this event right now.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {booths.map((booth) => (
                    <div
                      key={booth._id}
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 p-5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                          <Building2 size={23} />
                        </div>

                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          Available
                        </span>
                      </div>

                      <div className="p-5">
                        <h3 className="text-xl font-bold text-slate-900">
                          Booth {booth.boothNumber}
                        </h3>

                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-sm text-slate-500">
                            Booth Size
                          </span>

                          <span className="text-sm font-semibold capitalize text-slate-700">
                            {booth.size}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm text-slate-500">
                            Price
                          </span>

                          <span className="text-lg font-bold text-indigo-600">
                            {Number(booth.price || 0).toLocaleString()}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleReserve(booth._id)}
                          disabled={Boolean(reserving)}
                          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {reserving === booth._id ? (
                            <>
                              <Loader2 size={18} className="animate-spin" />
                              Reserving...
                            </>
                          ) : (
                            <>
                              <Store size={18} />
                              Reserve Booth
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default BoothReservation;
