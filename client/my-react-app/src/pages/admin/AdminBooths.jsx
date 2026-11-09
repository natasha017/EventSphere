import { useEffect, useMemo, useState } from "react";
import api from "../../../api/axios";
import "./AdminBooths.css";
const initialForm = {
  boothNumber: "",
  size: "medium",
  price: "",
};

const AdminBooths = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [booths, setBooths] = useState([]);

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch all events
const fetchEvents = async () => {
  try {
    setError("");

    const { data } = await api.get("/admin/events");

    console.log("Admin events:", data);

    const eventList = Array.isArray(data)
      ? data
      : data.events || [];

    setEvents(eventList);

    if (eventList.length > 0) {
      setSelectedEvent((current) =>
        current || eventList[0]._id
      );
    }
  } catch (err) {
    console.log("Fetch events error:", err.response?.data || err);

    setError(
      err.response?.data?.message || "Failed to load events"
    );
  }
};

  // Fetch booths for selected event
  const fetchBooths = async () => {
    if (!selectedEvent) {
      setBooths([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { data } = await api.get(
        `/events/${selectedEvent}/booths`
      );

      setBooths(data.booths || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load booths"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchBooths();
  }, [selectedEvent]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Create or update booth
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEvent) {
      alert("Please select an event first");
      return;
    }

    if (!form.boothNumber.trim() || form.price === "") {
      alert("Please enter booth number and price");
      return;
    }

    const price = Number(form.price);

    if (!Number.isFinite(price) || price < 0) {
      alert("Please enter a valid price");
      return;
    }

    const payload = {
      boothNumber: form.boothNumber.trim(),
      size: form.size,
      price,
    };

    try {
      setSaving(true);
      setError("");

      if (editingId) {
        await api.patch(
          `/events/${selectedEvent}/booths/${editingId}`,
          payload
        );

        alert("Booth updated successfully");
      } else {
        await api.post(
          `/events/${selectedEvent}/booths`,
          payload
        );

        alert("Booth created successfully");
      }

      setForm(initialForm);
      setEditingId(null);

      await fetchBooths();
    } catch (err) {
      alert(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  // Edit booth
  const handleEdit = (booth) => {
    setEditingId(booth._id);

    setForm({
      boothNumber: booth.boothNumber || "",
      size: booth.size || "medium",
      price: booth.price ?? "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  // Delete booth
  const handleDelete = async (boothId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booth?"
    );

    if (!confirmed) return;

    try {
      await api.delete(
        `/events/${selectedEvent}/booths/${boothId}`
      );

      alert("Booth deleted successfully");
      await fetchBooths();
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to delete booth"
      );
    }
  };

  // Booth statistics
  const stats = useMemo(() => {
    return {
      total: booths.length,
      available: booths.filter(
        (booth) => booth.status === "available"
      ).length,
      reserved: booths.filter(
        (booth) => booth.status === "reserved"
      ).length,
      occupied: booths.filter(
        (booth) => booth.status === "occupied"
      ).length,
    };
  }, [booths]);

  // Filter booths
  const filteredBooths = useMemo(() => {
    if (filter === "all") return booths;

    return booths.filter(
      (booth) => booth.status === filter
    );
  }, [booths, filter]);

  return (
    <div className="admin-booths">
      <div className="booths-header">
        <div>
          <h1>Booth Management</h1>
          <p>
            Create, manage and monitor event booth spaces.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchBooths}
          disabled={!selectedEvent || loading}
        >
          Refresh
        </button>
      </div>

      {/* Event Selection */}
      <div className="booth-event-selector">
        <label htmlFor="eventSelect">Select Event</label>

        <select
          id="eventSelect"
          value={selectedEvent}
          onChange={(e) => {
            setSelectedEvent(e.target.value);
            setEditingId(null);
            setForm(initialForm);
            setFilter("all");
          }}
        >
          {events.length === 0 && (
            <option value="">No events available</option>
          )}

          {events.map((event) => (
            <option key={event._id} value={event._id}>
              {event.title || event.name}
            </option>
          ))}
        </select>
      </div>

      {/* Statistics */}
      <div className="booth-stats">
        <div className="stat-card">
          <h3>Total Booths</h3>
          <p>{stats.total}</p>
        </div>

        <div className="stat-card available">
          <h3>Available</h3>
          <p>{stats.available}</p>
        </div>

        <div className="stat-card reserved">
          <h3>Reserved</h3>
          <p>{stats.reserved}</p>
        </div>

        <div className="stat-card occupied">
          <h3>Occupied</h3>
          <p>{stats.occupied}</p>
        </div>
      </div>

      {/* Create / Update Booth Form */}
      <div className="booth-form-card">
        <h2>
          {editingId ? "Update Booth" : "Create New Booth"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="boothNumber">Booth Number</label>

            <input
              id="boothNumber"
              type="text"
              name="boothNumber"
              placeholder="Example: A-101"
              value={form.boothNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="size">Booth Size</label>

            <select
              id="size"
              name="size"
              value={form.size}
              onChange={handleChange}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="price">Price</label>

            <input
              id="price"
              type="number"
              name="price"
              placeholder="Enter booth price"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={saving || !selectedEvent}>
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Booth"
                  : "Create Booth"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Booth List */}
      <div className="booth-list-card">
        <div className="booth-list-header">
          <h2>All Booths</h2>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Booths</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="occupied">Occupied</option>
          </select>
        </div>

        {error && (
          <p className="booth-error">{error}</p>
        )}

        {loading ? (
          <p>Loading booths...</p>
        ) : !selectedEvent ? (
          <p>Please create an event first.</p>
        ) : filteredBooths.length === 0 ? (
          <p>No booths found for this event.</p>
        ) : (
          <div className="booth-table-wrapper">
            <table className="booth-table">
              <thead>
                <tr>
                  <th>Booth Number</th>
                  <th>Size</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Assigned Exhibitor</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredBooths.map((booth) => (
                  <tr key={booth._id}>
                    <td>{booth.boothNumber}</td>

                    <td>
                      {booth.size}
                    </td>

                    <td>
                      {Number(booth.price).toLocaleString()}
                    </td>

                    <td>
                      <span
                        className={`booth-status ${booth.status}`}
                      >
                        {booth.status}
                      </span>
                    </td>

                    <td>
                      {booth.assignedTo?.username ||
                        booth.assignedTo?.email ||
                        "Not assigned"}
                    </td>

                    <td>
                      <div className="booth-actions">
                        <button
                          type="button"
                          onClick={() => handleEdit(booth)}
                          disabled={booth.status !== "available"}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(booth._id)}
                          disabled={booth.status !== "available"}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBooths;
