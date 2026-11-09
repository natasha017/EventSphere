
import Event from "../models/event.model.js";
import Application from "../models/application.model.js";
import Booth from "../models/booth.model.js";
import Session from "../models/session.model.js";
import User from "../models/user.model.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();

    const [
      totalEvents,
      publishedEvents,
      draftEvents,
      cancelledEvents,
      totalExhibitors,
      applicationStats,
      boothStats,
      totalSessions,
      upcomingSessionsCount,
      completedSessionsCount,
      recentEvents,
      recentApplications,
      upcomingSessions,
    ] = await Promise.all([

      // Event statistics
      Event.countDocuments(),
      Event.countDocuments({ status: "published" }),
      Event.countDocuments({ status: "draft" }),
      Event.countDocuments({ status: "cancelled" }),

      // Total registered exhibitor accounts
      User.countDocuments({ role: "exhibitor" }),

      // Application statistics
      Application.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      // Booth statistics
      Booth.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      // Session statistics
      Session.countDocuments(),

      Session.countDocuments({
        startTime: { $gte: now },
      }),

      Session.countDocuments({
        endTime: { $lt: now },
      }),

      // Latest 5 events
      Event.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),

      // Latest 5 applications
      Application.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("event", "title")
        .populate("exhibitor", "username email")
        .lean(),

      // Nearest 5 upcoming sessions
      Session.find({
        startTime: { $gte: now },
      })
        .sort({ startTime: 1 })
        .limit(5)
        .populate("event", "title")
        .lean(),
    ]);

    // Application counts
    const applications = {
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    applicationStats.forEach((item) => {
      applications[item._id] = item.count;
    });

    // Booth counts
    const booths = {
      available: 0,
      reserved: 0,
      occupied: 0,
    };

    boothStats.forEach((item) => {
      booths[item._id] = item.count;
    });

    const totalApplications =
      applications.pending +
      applications.approved +
      applications.rejected;

    const totalBooths =
      booths.available +
      booths.reserved +
      booths.occupied;

    const allocatedBooths =
      booths.reserved + booths.occupied;

    const occupancyPercentage =
      totalBooths > 0
        ? Math.round((allocatedBooths / totalBooths) * 100)
        : 0;

    return res.status(200).json({
      success: true,
      message: "Dashboard statistics fetched successfully",

      stats: {
        events: {
          total: totalEvents,
          published: publishedEvents,
          draft: draftEvents,
          cancelled: cancelledEvents,
        },

        exhibitors: {
          total: totalExhibitors,
        },

        applications: {
          total: totalApplications,
          ...applications,
        },

        booths: {
          total: totalBooths,
          ...booths,
          allocated: allocatedBooths,
          occupancyPercentage,
        },

        sessions: {
          total: totalSessions,
          upcoming: upcomingSessionsCount,
          completed: completedSessionsCount,
        },
      },

      recentEvents,
      recentApplications,
      upcomingSessions,
    });

  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    next(error);
  }
};
