
import { useEffect, useMemo, useState } from "react";
import api from "../../../api/axios";

const AdminExhibitors = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [selectedApplication, setSelectedApplication] =
    useState(null);

  // Booth assignment states
  const [assignApplication, setAssignApplication] = useState(null);
  const [availableBooths, setAvailableBooths] = useState([]);
  const [selectedBooth, setSelectedBooth] = useState("");
  const [boothLoading, setBoothLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);

  // Fetch all applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/admin/applications");

      setApplications(data.applications || []);
    } catch (err) {
      console.error("Fetch applications error:", err);

      setError(
        err.response?.data?.message ||
        "Failed to load applications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Approve or reject application
  const handleUpdateStatus = async (id, newStatus, e) => {
    e?.stopPropagation();

    try {
      setActionLoading(id);

      const application = applications.find(
        (app) => app._id === id
      );

      if (!application) {
        throw new Error("Application not found");
      }

      const eventId =
        application.event?._id || application.event;

      if (!eventId) {
        throw new Error("Event ID not found");
      }

      const status = newStatus.toLowerCase();

      const { data } = await api.patch(
        `/admin/events/${eventId}/applications/${id}`,
        { status }
      );

      if (!data.success) {
        throw new Error(
          data.message || "Status update failed"
        );
      }

      setApplications((prev) =>
        prev.map((app) =>
          app._id === id
            ? { ...app, ...data.application }
            : app
        )
      );

      setSelectedApplication((prev) =>
        prev?._id === id
          ? { ...prev, ...data.application }
          : prev
      );

      alert(`Application ${status} successfully!`);
    } catch (err) {
      console.error("Update status error:", err);

      alert(
        err.response?.data?.message ||
        err.message ||
        "Failed to update application"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // Open booth assignment modal and fetch available booths
  const handleOpenAssign = async (application) => {
    try {
      const eventId =
        application.event?._id || application.event;

      if (!eventId) {
        throw new Error("Event ID not found");
      }

      setAssignApplication(application);
      setSelectedBooth("");
      setAvailableBooths([]);
      setBoothLoading(true);

      const { data } = await api.get(
        `/events/${eventId}/booths`
      );

      const booths = data.booths || [];

      setAvailableBooths(
        booths.filter(
          (booth) =>
            booth.status === "available" &&
            !booth.assignedTo
        )
      );
    } catch (err) {
      console.error("Fetch booths error:", err);

      alert(
        err.response?.data?.message ||
        "Failed to load available booths"
      );

      setAssignApplication(null);
    } finally {
      setBoothLoading(false);
    }
  };

  // Assign selected booth
  const handleAssignBooth = async () => {
    if (!assignApplication || !selectedBooth) {
      alert("Please select a booth");
      return;
    }

    try {
      setAssigning(true);

      const eventId =
        assignApplication.event?._id ||
        assignApplication.event;

      const { data } = await api.patch(
        `/admin/events/${eventId}/applications/${assignApplication._id}/assign-booth`,
        {
          boothId: selectedBooth,
        }
      );

      if (!data.success) {
        throw new Error(
          data.message || "Booth assignment failed"
        );
      }

      // Update application list
      setApplications((prev) =>
        prev.map((app) =>
          app._id === assignApplication._id
            ? data.application
            : app
        )
      );

      // Update details modal if open
      setSelectedApplication((prev) =>
        prev?._id === assignApplication._id
          ? data.application
          : prev
      );

      setAssignApplication(null);
      setSelectedBooth("");

      alert("Booth assigned successfully!");
    } catch (err) {
      console.error("Assign booth error:", err);

      alert(
        err.response?.data?.message ||
        err.message ||
        "Failed to assign booth"
      );
    } finally {
      setAssigning(false);
    }
  };

  // Statistics
  const totalApplications = applications.length;

  const pendingApplications = applications.filter(
    (app) => app.status === "pending"
  ).length;

  const approvedApplications = applications.filter(
    (app) => app.status === "approved"
  ).length;

  const rejectedApplications = applications.filter(
    (app) => app.status === "rejected"
  ).length;

  // Search and filter
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const companyName = app.companyName || "";
      const exhibitorName =
        app.exhibitor?.username || "";
      const email = app.exhibitor?.email || "";
      const eventName = app.event?.title || "";

      const searchValue = search.toLowerCase();

      const matchesSearch =
        companyName.toLowerCase().includes(searchValue) ||
        exhibitorName.toLowerCase().includes(searchValue) ||
        email.toLowerCase().includes(searchValue) ||
        eventName.toLowerCase().includes(searchValue);

      const matchesStatus =
        filterStatus === "all" ||
        app.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, filterStatus]);

  const getStatusStyle = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };

    return styles[status] || "bg-gray-100 text-gray-700";
  };

  // Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p className="text-gray-600 text-lg">
          Loading applications...
        </p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600 mb-4">{error}</p>

        <button
          onClick={fetchApplications}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Exhibitor Management
          </h1>

          <p className="text-gray-500 mt-1">
            Manage exhibitor applications, approvals and booth assignments.
          </p>
        </div>

        <button
          onClick={fetchApplications}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg"
        >
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        <div className="bg-white shadow rounded-xl p-5">
          <p className="text-gray-500">Total Applications</p>
          <h2 className="text-3xl font-bold mt-2">
            {totalApplications}
          </h2>
        </div>

        <div className="bg-yellow-50 shadow rounded-xl p-5">
          <p className="text-yellow-700">Pending</p>
          <h2 className="text-3xl font-bold text-yellow-700 mt-2">
            {pendingApplications}
          </h2>
        </div>

        <div className="bg-green-50 shadow rounded-xl p-5">
          <p className="text-green-700">Approved</p>
          <h2 className="text-3xl font-bold text-green-700 mt-2">
            {approvedApplications}
          </h2>
        </div>

        <div className="bg-red-50 shadow rounded-xl p-5">
          <p className="text-red-700">Rejected</p>
          <h2 className="text-3xl font-bold text-red-700 mt-2">
            {rejectedApplications}
          </h2>
        </div>

      </div>

      {/* Search and Filter */}
      <div className="bg-white shadow rounded-xl p-4 flex flex-col md:flex-row gap-4">

        <input
          type="text"
          placeholder="Search company, exhibitor or event..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-3 flex-1 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Applications</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

      </div>

      {/* Applications Table */}
      <div className="bg-white shadow rounded-xl overflow-hidden">

        <div className="p-5 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Exhibitor Applications
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            {filteredApplications.length} applications found
          </p>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No applications found.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-left min-w-[1050px]">

              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-4">Company</th>
                  <th className="p-4">Exhibitor</th>
                  <th className="p-4">Event</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Assigned Booth</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredApplications.map((application) => (
                  <tr
                    key={application._id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="p-4 font-medium">
                      {application.companyName}
                    </td>

                    <td className="p-4">
                      <p className="font-medium">
                        {application.exhibitor?.username || "N/A"}
                      </p>

                      <p className="text-sm text-gray-500">
                        {application.exhibitor?.email || "N/A"}
                      </p>
                    </td>

                    <td className="p-4">
                      {application.event?.title || "N/A"}
                    </td>

                    <td className="p-4 text-sm">
                      {application.createdAt
                        ? new Date(
                            application.createdAt
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyle(
                          application.status
                        )}`}
                      >
                        {application.status}
                      </span>
                    </td>

                    {/* Assigned Booth */}
                    <td className="p-4">
                      {application.booth?.boothNumber ? (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {application.booth.boothNumber}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          Not assigned
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">

                        <button
                          onClick={() =>
                            setSelectedApplication(application)
                          }
                          className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm"
                        >
                          View
                        </button>

                        {application.status === "pending" && (
                          <>
                            <button
                              onClick={(e) =>
                                handleUpdateStatus(
                                  application._id,
                                  "approved",
                                  e
                                )
                              }
                              disabled={actionLoading === application._id}
                              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-2 rounded-lg text-sm"
                            >
                              {actionLoading === application._id
                                ? "Updating..."
                                : "Approve"}
                            </button>

                            <button
                              onClick={(e) =>
                                handleUpdateStatus(
                                  application._id,
                                  "rejected",
                                  e
                                )
                              }
                              disabled={actionLoading === application._id}
                              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-3 py-2 rounded-lg text-sm"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {application.status === "approved" &&
                          !application.booth && (
                            <button
                              onClick={() =>
                                handleOpenAssign(application)
                              }
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm"
                            >
                              Assign Booth
                            </button>
                          )}

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedApplication(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="text-xl font-bold">
                Application Details
              </h2>

              <button
                onClick={() => setSelectedApplication(null)}
                className="text-2xl text-gray-500 hover:text-gray-800"
              >
                &times;
              </button>
            </div>

            <div className="p-5 space-y-4">

              <div>
                <p className="text-sm text-gray-500">Company Name</p>
                <p className="font-semibold">
                  {selectedApplication.companyName}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Exhibitor Name</p>
                <p className="font-semibold">
                  {selectedApplication.exhibitor?.username || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold">
                  {selectedApplication.exhibitor?.email || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Event</p>
                <p className="font-semibold">
                  {selectedApplication.event?.title || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-gray-700">
                  {selectedApplication.description ||
                    "No description provided"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Application Status</p>
                <span
                  className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusStyle(
                    selectedApplication.status
                  )}`}
                >
                  {selectedApplication.status}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500">Assigned Booth</p>
                <p className="font-semibold">
                  {selectedApplication.booth?.boothNumber ||
                    "Not assigned"}
                </p>
              </div>

              {selectedApplication.status === "pending" && (
                <div className="flex flex-wrap gap-3 pt-4 border-t">

                  <button
                    onClick={(e) =>
                      handleUpdateStatus(
                        selectedApplication._id,
                        "approved",
                        e
                      )
                    }
                    disabled={
                      actionLoading === selectedApplication._id
                    }
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg"
                  >
                    Approve Application
                  </button>

                  <button
                    onClick={(e) =>
                      handleUpdateStatus(
                        selectedApplication._id,
                        "rejected",
                        e
                      )
                    }
                    disabled={
                      actionLoading === selectedApplication._id
                    }
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg"
                  >
                    Reject Application
                  </button>

                </div>
              )}

              {selectedApplication.status === "approved" &&
                !selectedApplication.booth && (
                  <button
                    onClick={() =>
                      handleOpenAssign(selectedApplication)
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                  >
                    Assign Booth
                  </button>
                )}

            </div>
          </div>
        </div>
      )}

      {/* Assign Booth Modal */}
      {assignApplication && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold">
                Assign Booth
              </h2>

              <button
                onClick={() => setAssignApplication(null)}
                disabled={assigning}
                className="text-2xl text-gray-500"
              >
                &times;
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500">Company</p>
              <p className="font-semibold">
                {assignApplication.companyName}
              </p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500">Exhibitor</p>
              <p className="font-semibold">
                {assignApplication.exhibitor?.username || "N/A"}
              </p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500">Event</p>
              <p className="font-semibold">
                {assignApplication.event?.title || "N/A"}
              </p>
            </div>

            <label className="block text-sm font-medium mb-2">
              Select Available Booth
            </label>

            {boothLoading ? (
              <p className="text-gray-500 mb-5">
                Loading booths...
              </p>
            ) : (
              <select
                value={selectedBooth}
                onChange={(e) =>
                  setSelectedBooth(e.target.value)
                }
                className="w-full border rounded-lg px-4 py-3 mb-5"
              >
                <option value="">Choose a booth</option>

                {availableBooths.map((booth) => (
                  <option key={booth._id} value={booth._id}>
                    {booth.boothNumber} - {booth.size} - Rs. {booth.price}
                  </option>
                ))}
              </select>
            )}

            {!boothLoading && availableBooths.length === 0 && (
              <p className="text-red-600 text-sm mb-4">
                No available booths for this event.
              </p>
            )}

            <div className="flex gap-3">

              <button
                onClick={() => setAssignApplication(null)}
                disabled={assigning}
                className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleAssignBooth}
                disabled={
                  assigning ||
                  boothLoading ||
                  !selectedBooth
                }
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded-lg"
              >
                {assigning ? "Assigning..." : "Assign Booth"}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminExhibitors;
