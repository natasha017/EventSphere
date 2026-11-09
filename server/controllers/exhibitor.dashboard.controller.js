import Application from "../models/application.model.js";

const getDashboardStats = async (req, res, next) => {
  try {
    const exhibitorId = req.user._id;

    const [
      totalApplications,
      approvedApplications,
      pendingApplications,
      rejectedApplications,
      reservedBooths,
      recentApplications,
    ] = await Promise.all([
      Application.countDocuments({
        exhibitor: exhibitorId,
      }),

      Application.countDocuments({
        exhibitor: exhibitorId,
        status: "approved",
      }),

      Application.countDocuments({
        exhibitor: exhibitorId,
        status: "pending",
      }),

      Application.countDocuments({
        exhibitor: exhibitorId,
        status: "rejected",
      }),

      Application.countDocuments({
        exhibitor: exhibitorId,
        booth: { $ne: null },
      }),

      Application.find({
        exhibitor: exhibitorId,
      })
        .populate(
          "event",
          "title image location startDate endDate status"
        )
        .populate(
          "booth",
          "boothNumber size price status"
        )
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    const upcomingExpos = recentApplications
      .filter(
        (application) =>
          application.event &&
          application.event.status === "published" &&
          new Date(application.event.startDate) >= new Date()
      )
      .map((application) => ({
        _id: application.event._id,
        title: application.event.title,
        image: application.event.image,
        location: application.event.location,
        startDate: application.event.startDate,
        endDate: application.event.endDate,
        applicationStatus: application.status,
      }));

    return res.status(200).json({
      success: true,
      message: "Exhibitor dashboard data fetched successfully",
      stats: {
        totalApplications,
        approvedApplications,
        pendingApplications,
        rejectedApplications,
        reservedBooths,
      },
      recentApplications,
      upcomingExpos,
    });
  } catch (error) {
    next(error);
  }
};

const exhibitorDashboardController = {
  getDashboardStats,
};

export default exhibitorDashboardController;