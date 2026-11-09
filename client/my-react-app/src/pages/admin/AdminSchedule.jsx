
import { useEffect, useState } from "react";
import {
    CalendarDays,
    Clock,
    Plus,
    Pencil,
    Trash2,
    X,
    Loader2,
    MapPin,
    FileText,
} from "lucide-react";

import { toast } from "react-toastify";
import api from "../../../api/axios";

const initialForm = {
    title: "",
    description: "",
    startTime: "",
    endTime: "",
};

const toLocalDateTime = (date) => {
    const d = new Date(date);
    const pad = (value) => String(value).padStart(2, "0");

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
        d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const AdminSchedule = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState("");
    const [sessions, setSessions] = useState([]);

    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [fetchingEvents, setFetchingEvents] = useState(true);
    const [fetchingSessions, setFetchingSessions] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const selectedEventData = events.find(
        (event) => event._id === selectedEvent
    );

    // Fetch admin events
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setFetchingEvents(true);

                const response = await api.get("/admin/events");
                const eventList = response.data.events || [];

                setEvents(eventList);
            } catch (error) {
                toast.error(
                    error.response?.data?.message || "Failed to fetch events"
                );
            } finally {
                setFetchingEvents(false);
            }
        };

        fetchEvents();
    }, []);

    // Fetch sessions for selected event
    useEffect(() => {
        if (!selectedEvent) {
            setSessions([]);
            setFetchingSessions(false);
            return;
        }

        let ignore = false;

        const fetchSessions = async () => {
            try {
                setFetchingSessions(true);
                setSessions([]);

                const response = await api.get(
                    `/events/${selectedEvent}/admin-sessions`
                );

                if (!ignore) {
                    setSessions(response.data.sessions || []);
                }
            } catch (error) {
                if (!ignore) {
                    setSessions([]);
                    toast.error(
                        error.response?.data?.message ||
                        "Failed to fetch sessions"
                    );
                }
            } finally {
                if (!ignore) {
                    setFetchingSessions(false);
                }
            }
        };

        fetchSessions();

        return () => {
            ignore = true;
        };
    }, [selectedEvent]);

    const refreshSessions = async () => {
        if (!selectedEvent) return;

        const response = await api.get(
            `/events/${selectedEvent}/admin-sessions`
        );

        setSessions(response.data.sessions || []);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setForm(initialForm);
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedEvent) {
            toast.error("Please select an event");
            return;
        }

        if (!form.title.trim()) {
            toast.error("Session title is required");
            return;
        }

        const start = new Date(form.startTime);
        const end = new Date(form.endTime);

        if (
            !form.startTime ||
            !form.endTime ||
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime()) ||
            end <= start
        ) {
            toast.error("End time must be after start time");
            return;
        }

        if (selectedEventData) {
            const eventStart = new Date(selectedEventData.startDate);
            const eventEnd = new Date(selectedEventData.endDate);

            const startDate = start.toISOString().slice(0, 10);
            const endDate = end.toISOString().slice(0, 10);
            const minDate = eventStart.toISOString().slice(0, 10);
            const maxDate = eventEnd.toISOString().slice(0, 10);

            if (startDate < minDate || endDate > maxDate) {
                toast.error("Session must be within the event dates");
                return;
            }
        }

        const payload = {
            title: form.title.trim(),
            description: form.description.trim(),
            startTime: start.toISOString(),
            endTime: end.toISOString(),
        };

        try {
            setSaving(true);

            if (editingId) {
                const response = await api.patch(
                    `/events/${selectedEvent}/sessions/${editingId}`,
                    payload
                );

                toast.success(
                    response.data.message || "Session updated successfully"
                );
            } else {
                const response = await api.post(
                    `/events/${selectedEvent}/sessions`,
                    payload
                );

                toast.success(
                    response.data.message || "Session created successfully"
                );
            }

            resetForm();
            await refreshSessions();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to save session"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (session) => {
        setEditingId(session._id);

        setForm({
            title: session.title || "",
            description: session.description || "",
            startTime: toLocalDateTime(session.startTime),
            endTime: toLocalDateTime(session.endTime),
        });

        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (sessionId) => {
        if (!window.confirm("Are you sure you want to delete this session?")) {
            return;
        }

        try {
            setDeletingId(sessionId);

            const response = await api.delete(
                `/events/${selectedEvent}/sessions/${sessionId}`
            );

            toast.success(
                response.data.message || "Session deleted successfully"
            );

            await refreshSessions();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to delete session"
            );
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-8 pb-12">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <p className="text-sm font-semibold text-indigo-600 mb-1">
                        EventSphere Admin Portal
                    </p>

                    <h1 className="text-2xl font-bold text-slate-900">
                        Schedule Management
                    </h1>

                    <p className="text-sm text-slate-500 mt-1">
                        Create and manage sessions for your events.
                    </p>
                </div>

                <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <CalendarDays size={26} />
                </div>
            </div>

            {/* Event Selection */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                    Select Event
                </h2>

                {fetchingEvents ? (
                    <p className="text-sm text-slate-500">Loading events...</p>
                ) : events.length === 0 ? (
                    <p className="text-sm text-slate-500">
                        No events found. Create an event first.
                    </p>
                ) : (
                    <select
                        value={selectedEvent}
                        onChange={(e) => {
                            setSelectedEvent(e.target.value);
                            resetForm();
                        }}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-sm"
                    >
                        <option value="">Choose an event</option>

                        {events.map((event) => (
                            <option key={event._id} value={event._id}>
                                {event.title} ({event.status})
                            </option>
                        ))}
                    </select>
                )}

                {selectedEventData && (
                    <div className="mt-5 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                        <h3 className="font-bold text-indigo-900">
                            {selectedEventData.title}
                        </h3>

                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-indigo-700">
                            <span className="flex items-center gap-2">
                                <MapPin size={16} />
                                {selectedEventData.location}
                            </span>

                            <span className="flex items-center gap-2">
                                <CalendarDays size={16} />
                                {new Date(selectedEventData.startDate).toLocaleDateString()}
                                {" - "}
                                {new Date(selectedEventData.endDate).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Session Management */}
            {selectedEvent && (
                <section className="space-y-6">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                Manage Sessions
                            </h2>

                            <p className="text-sm text-slate-500 mt-1">
                                Add, update and organize event sessions.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                resetForm();
                                setShowForm(true);
                            }}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold"
                        >
                            <Plus size={18} />
                            Add Session
                        </button>
                    </div>

                    {/* Form */}
                    {showForm && (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between p-5 border-b bg-slate-50">
                                <h3 className="font-bold text-slate-900">
                                    {editingId ? "Update Session" : "Create New Session"}
                                </h3>

                                <button type="button" onClick={resetForm}>
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        Session Title *
                                    </label>

                                    <input
                                        type="text"
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        required
                                        maxLength={150}
                                        placeholder="Enter session title"
                                        className="w-full px-4 py-3 border rounded-xl bg-slate-50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Enter session description"
                                        className="w-full px-4 py-3 border rounded-xl bg-slate-50 resize-y"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">
                                            Start Time *
                                        </label>

                                        <input
                                            type="datetime-local"
                                            name="startTime"
                                            value={form.startTime}
                                            onChange={handleChange}
                                            required
                                            min={selectedEventData?.startDate
                                                ? toLocalDateTime(selectedEventData.startDate)
                                                : undefined}
                                            max={selectedEventData?.endDate
                                                ? toLocalDateTime(selectedEventData.endDate)
                                                : undefined}
                                            className="w-full px-4 py-3 border rounded-xl bg-slate-50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2">
                                            End Time *
                                        </label>

                                        <input
                                            type="datetime-local"
                                            name="endTime"
                                            value={form.endTime}
                                            onChange={handleChange}
                                            required
                                            min={form.startTime || undefined}
                                            max={selectedEventData?.endDate
                                                ? toLocalDateTime(selectedEventData.endDate)
                                                : undefined}
                                            className="w-full px-4 py-3 border rounded-xl bg-slate-50"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        disabled={saving}
                                        className="px-5 py-2.5 border rounded-xl text-sm font-semibold"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
                                    >
                                        {saving ? (
                                            <Loader2 size={17} className="animate-spin" />
                                        ) : (
                                            <Plus size={17} />
                                        )}

                                        {saving
                                            ? "Saving..."
                                            : editingId
                                            ? "Update Session"
                                            : "Create Session"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Sessions List */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b">
                            <h3 className="font-bold text-slate-900">
                                Event Sessions
                            </h3>

                            <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                                Total: {sessions.length}
                            </span>
                        </div>

                        {fetchingSessions ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="animate-spin text-indigo-600" size={32} />
                            </div>
                        ) : sessions.length === 0 ? (
                            <div className="text-center py-12 px-5">
                                <FileText className="mx-auto text-slate-300 mb-3" size={40} />

                                <h3 className="font-bold text-slate-700">
                                    No sessions found
                                </h3>

                                <p className="text-sm text-slate-500 mt-1">
                                    Add your first session for this event.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {sessions.map((session) => (
                                    <div
                                        key={session._id}
                                        className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-slate-50"
                                    >
                                        <div className="space-y-2">
                                            <h3 className="font-bold text-slate-900">
                                                {session.title}
                                            </h3>

                                            <p className="text-sm text-slate-500">
                                                {session.description || "No description provided"}
                                            </p>

                                            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                                                <span className="flex items-center gap-1.5">
                                                    <CalendarDays size={15} />
                                                    {new Date(session.startTime).toLocaleDateString()}
                                                </span>

                                                <span className="flex items-center gap-1.5">
                                                    <Clock size={15} />
                                                    {new Date(session.startTime).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                    {" - "}
                                                    {new Date(session.endTime).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(session)}
                                                disabled={deletingId === session._id}
                                                className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-semibold"
                                            >
                                                <Pencil size={15} />
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDelete(session._id)}
                                                disabled={deletingId === session._id}
                                                className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 text-rose-600 rounded-lg text-sm font-semibold disabled:opacity-50"
                                            >
                                                {deletingId === session._id ? (
                                                    <Loader2 size={15} className="animate-spin" />
                                                ) : (
                                                    <Trash2 size={15} />
                                                )}
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
};

export default AdminSchedule;
