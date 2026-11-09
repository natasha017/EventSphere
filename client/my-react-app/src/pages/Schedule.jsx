
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  CalendarCheck,
  Loader2,
  Search,
  AlertCircle,
  Mic2,
} from "lucide-react";

import api from "../../api/axios";

const Schedule = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [sessions, setSessions] = useState([]);

  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(false);

  const [error, setError] = useState("");

  // Backend origin for uploaded images
  const API_ORIGIN = api.defaults.baseURL.replace(/\/api\/?$/, "");

  // Generate correct image URL
  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http")) {
      return image;
    }

    return `${API_ORIGIN}/${image.replace(/^\/+/, "")}`;
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "Date not available";

    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Format time
  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Fetch published events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);
        setError("");

        const response = await api.get("/events/published");

        const eventList = response.data.events || [];

        setEvents(eventList);

        if (eventList.length > 0) {
          setSelectedEvent(eventList[0]._id);
        }
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load events"
        );
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  // Fetch sessions when selected event changes
  useEffect(() => {
    if (!selectedEvent) {
      setSessions([]);
      setLoadingSessions(false);
      return;
    }

    let ignore = false;

    const fetchSessions = async () => {
      try {
        setLoadingSessions(true);
        setSessions([]);
        setError("");

        const response = await api.get(
          `/events/${selectedEvent}/sessions`
        );

        if (!ignore) {
          setSessions(response.data.sessions || []);
        }
      } catch (error) {
        if (!ignore) {
          setError(
            error.response?.data?.message ||
              "Failed to load schedule"
          );
        }
      } finally {
        if (!ignore) {
          setLoadingSessions(false);
        }
      }
    };

    fetchSessions();

    return () => {
      ignore = true;
    };
  }, [selectedEvent]);

  // Selected event details
  const event = events.find(
    (item) => item._id === selectedEvent
  );

  // Group sessions by date
  const groupedSessions = sessions.reduce((groups, session) => {
    const date = new Date(session.startTime);

    const dateKey = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }

    groups[dateKey].push(session);

    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 px-4 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl text-center">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium">
            <CalendarDays className="h-4 w-4" />
            Event Schedule
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Explore Event Sessions
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-indigo-100 sm:text-base">
            Discover upcoming sessions, explore exciting topics,
            and plan your experience at EventSphere expos.
          </p>

        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-8">

        {/* Event Selection */}
        <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

          <div className="mb-5 flex items-center gap-3">

            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <CalendarCheck className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Select an Expo
              </h2>

              <p className="text-sm text-slate-500">
                Choose an event to explore its schedule.
              </p>
            </div>

          </div>

          {loadingEvents ? (
            <div className="flex items-center gap-2 py-4 text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading events...
            </div>
          ) : events.length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
              No published events available right now.
            </p>
          ) : (
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {events.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.title}
                </option>
              ))}
            </select>
          )}

        </section>

        {/* Selected Event Details */}
        {event && (
          <section className="mb-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Event Image */}
            {event.image && (
              <img
                src={getImageUrl(event.image)}
                alt={event.title}
                className="h-56 w-full object-cover sm:h-72"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}

            <div className="p-5 sm:p-7">

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Published Event
              </span>

              <h2 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
                {event.title}
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                {event.description}
              </p>

              <div className="mt-6 flex flex-col gap-4 text-sm text-slate-600 sm:flex-row sm:flex-wrap">

                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-indigo-600" />
                  {formatDate(event.startDate)} - {formatDate(event.endDate)}
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-indigo-600" />
                  {event.location}
                </div>

              </div>

            </div>
          </section>
        )}

        {/* Schedule Heading */}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Event Schedule
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Explore all available sessions.
            </p>
          </div>

          {!loadingSessions && (
            <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
              Total: {sessions.length} Sessions
            </span>
          )}

        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error}
          </div>
        )}

        {/* Loading State */}
        {loadingSessions && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16">
            <Loader2 className="mb-4 h-9 w-9 animate-spin text-indigo-600" />

            <p className="font-medium text-slate-600">
              Loading sessions...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loadingSessions &&
          !error &&
          selectedEvent &&
          sessions.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">

              <Search className="mx-auto mb-4 h-12 w-12 text-slate-300" />

              <h3 className="text-lg font-bold text-slate-800">
                No Sessions Available
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Sessions for this event have not been added yet.
              </p>

            </div>
          )}

        {/* Sessions List */}
        {!loadingSessions &&
          !error &&
          Object.keys(groupedSessions).length > 0 && (

            <div className="space-y-10">

              {Object.entries(groupedSessions)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([date, dateSessions]) => (

                  <section key={date}>

                    {/* Session Date */}
                    <div className="mb-5 flex items-center gap-3">

                      <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
                        <CalendarDays className="h-5 w-5" />
                      </div>

                      <h3 className="text-lg font-bold text-slate-900">
                        {formatDate(date)}
                      </h3>

                    </div>

                    {/* Sessions */}
                    <div className="space-y-4">

                      {dateSessions.map((session) => (

                        <article
                          key={session._id}
                          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md sm:p-6"
                        >

                          <div className="flex flex-col gap-5 sm:flex-row">

                            {/* Session Time */}
                            <div className="flex shrink-0 items-start gap-3 sm:w-48">

                              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                                <Clock className="h-6 w-6" />
                              </div>

                              <div>
                                <p className="text-sm font-bold text-indigo-700">
                                  {formatTime(session.startTime)}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  to {formatTime(session.endTime)}
                                </p>
                              </div>

                            </div>

                            {/* Session Details */}
                            <div className="min-w-0 flex-1">

                              <div className="mb-2 flex items-center gap-2">
                                <Mic2 className="h-4 w-4 text-indigo-500" />

                                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                                  Event Session
                                </span>
                              </div>

                              <h4 className="text-lg font-bold text-slate-900 transition group-hover:text-indigo-700">
                                {session.title}
                              </h4>

                              <p className="mt-2 text-sm leading-7 text-slate-600">
                                {session.description ||
                                  "No description available."}
                              </p>

                            </div>

                          </div>

                        </article>

                      ))}

                    </div>

                  </section>

                ))}

            </div>
          )}

      </main>
    </div>
  );
};

export default Schedule;
