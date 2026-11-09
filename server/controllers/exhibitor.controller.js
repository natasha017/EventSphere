
import Event from "../models/event.model.js";
import Application from "../models/application.model.js";
import Booth from "../models/booth.model.js";
import validateObjectId from "../utils/validateObjectId.js";
import ExhibitorProfile from "../models/exhibitorProfile.model.js";

const createApplication = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { companyName, description } = req.body;

    // Validate event ID
    if (!validateObjectId(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    // Validate company name
    if (
      typeof companyName !== "string" ||
      !companyName.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    // Find event
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Only published events accept applications
    if (event.status !== "published") {
      return res.status(400).json({
        success: false,
        message: "Applications are not available for this event",
      });
    }

    // Check duplicate application
    const existingApplication = await Application.findOne({
      event: event._id,
      exhibitor: req.user._id,
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied to this event",
      });
    }

    // Create application
    const application = await Application.create({
      event: event._id,
      exhibitor: req.user._id,
      companyName: companyName.trim(),
      description:
        typeof description === "string"
          ? description.trim()
          : "",
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    // Handle duplicate key error from unique index
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already applied to this event",
      });
    }

    return next(error);
  }
};

const getApplications = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    if (!validateObjectId(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    const eventFilter =
      req.user.role === "admin"
        ? { _id: eventId }
        : {
            _id: eventId,
            createdBy: req.user._id,
          };

    const event = await Event.findOne(eventFilter);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found or access denied",
      });
    }

    const applications = await Application.find({
      event: event._id,
    })
      .populate("exhibitor", "username email")
      .populate("booth", "boothNumber size price status")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    return next(error);
  }
};

const updateApplicationStatus = async (req, res, next) => {
  try {
    const { eventId, applicationId } = req.params;
    const { status } = req.body;

    // Validate IDs
    if (
      !validateObjectId(eventId) ||
      !validateObjectId(applicationId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID or application ID",
      });
    }

    // Validate status
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be approved or rejected",
      });
    }

    // Admin can access all events.
    // Other authorized users can access only their own events.
    const eventFilter =
      req.user.role === "admin"
        ? { _id: eventId }
        : {
            _id: eventId,
            createdBy: req.user._id,
          };

    const event = await Event.findOne(eventFilter);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found or access denied",
      });
    }

    // Find application
    const application = await Application.findOne({
      _id: applicationId,
      event: event._id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Prevent status change if booth is assigned
    if (application.booth) {
      return res.status(400).json({
        success: false,
        message: "Unassign the booth before changing application status",
      });
    }

    // Update status
    application.status = status;

    await application.save();

    return res.status(200).json({
      success: true,
      message: `Application ${status} successfully`,
      application,
    });
  } catch (error) {
    return next(error);
  }
};

const reservedBooth = async (req, res, next) => {
  let reservedBoothId = null;

  try {
    const { eventId, boothId } = req.params;

    // Validate IDs
    if (
      !validateObjectId(eventId) ||
      !validateObjectId(boothId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID or booth ID",
      });
    }

    // Find exhibitor application
    const application = await Application.findOne({
      event: eventId,
      exhibitor: req.user._id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "You have not applied to this event",
      });
    }

    // Application must be approved
    if (application.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Your application must be approved first",
      });
    }

    // Check existing booth reservation
    if (application.booth) {
      return res.status(400).json({
        success: false,
        message: "You have already reserved a booth",
      });
    }

    // Atomically reserve available booth
    const booth = await Booth.findOneAndUpdate(
      {
        _id: boothId,
        event: eventId,
        status: "available",
      },
      {
        $set: {
          status: "reserved",
          assignedTo: req.user._id,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!booth) {
      return res.status(409).json({
        success: false,
        message: "Booth is unavailable or does not belong to this event",
      });
    }

    reservedBoothId = booth._id;

    // Attach booth to exhibitor application
    const updatedApplication = await Application.findOneAndUpdate(
      {
        _id: application._id,
        event: eventId,
        exhibitor: req.user._id,
        status: "approved",
        booth: null,
      },
      {
        $set: {
          booth: booth._id,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    // Rollback booth if application update fails
    if (!updatedApplication) {
      await Booth.updateOne(
        {
          _id: booth._id,
          assignedTo: req.user._id,
          status: "reserved",
        },
        {
          $set: {
            status: "available",
            assignedTo: null,
          },
        }
      );

      reservedBoothId = null;

      return res.status(409).json({
        success: false,
        message: "A booth may already be reserved. Refresh and try again.",
      });
    }

    reservedBoothId = null;

    return res.status(200).json({
      success: true,
      message: "Booth reserved successfully",
      booth,
      application: updatedApplication,
    });
  } catch (error) {
    // Rollback booth if any operation fails
    if (reservedBoothId) {
      try {
        await Booth.updateOne(
          {
            _id: reservedBoothId,
            assignedTo: req.user._id,
            status: "reserved",
          },
          {
            $set: {
              status: "available",
              assignedTo: null,
            },
          }
        );
      } catch (rollbackError) {
        console.error("Booth rollback failed:", rollbackError);
        return next(rollbackError);
      }
    }

    return next(error);
  }
};

const getAllApplications = async (req, res, next) => {
  try {
    const applications = await Application.find()
      .populate("event", "title startDate endDate location")
      .populate("exhibitor", "username email")
      .populate("booth", "boothNumber size price status")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    return next(error);
  }
};

const assignBoothToApplication = async (req, res, next) => {
  let assignedBoothId = null;

  try {
    const { eventId, applicationId } = req.params;
    const { boothId } = req.body;

    if (
      !validateObjectId(eventId) ||
      !validateObjectId(applicationId) ||
      !validateObjectId(boothId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid event, application, or booth ID",
      });
    }

    const application = await Application.findOne({
      _id: applicationId,
      event: eventId,
      status: "approved",
      booth: null,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Approved application not found or booth already assigned",
      });
    }

    // Only an available booth belonging to this event can be assigned
    const booth = await Booth.findOneAndUpdate(
      {
        _id: boothId,
        event: eventId,
        status: "available",
        assignedTo: null,
      },
      {
        $set: {
          status: "reserved",
          assignedTo: application.exhibitor,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!booth) {
      return res.status(409).json({
        success: false,
        message: "Booth is unavailable or belongs to another event",
      });
    }

    assignedBoothId = booth._id;

    const updatedApplication = await Application.findOneAndUpdate(
      {
        _id: applicationId,
        event: eventId,
        status: "approved",
        booth: null,
      },
      {
        $set: { booth: booth._id },
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    )
      .populate("event", "title")
      .populate("exhibitor", "username email")
      .populate("booth", "boothNumber size price status");

    if (!updatedApplication) {
      // Roll back the booth if application update fails
      await Booth.updateOne(
        {
          _id: booth._id,
          assignedTo: application.exhibitor,
          status: "reserved",
        },
        {
          $set: {
            status: "available",
            assignedTo: null,
          },
        }
      );

      assignedBoothId = null;

      return res.status(409).json({
        success: false,
        message: "Application was updated. Please refresh and try again.",
      });
    }

    assignedBoothId = null;

    return res.status(200).json({
      success: true,
      message: "Booth assigned successfully",
      application: updatedApplication,
    });
  } catch (error) {
    if (assignedBoothId) {
      try {
        await Booth.updateOne(
          {
            _id: assignedBoothId,
            status: "reserved",
          },
          {
            $set: {
              status: "available",
              assignedTo: null,
            },
          }
        );
      } catch (rollbackError) {
        console.error("Booth assignment rollback failed:", rollbackError);
      }
    }

    return next(error);
  }
};

const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({
      exhibitor: req.user._id,
    })
      .populate("event", "title startDate endDate location")
      .populate("booth", "boothNumber size price status")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    return next(error);
  }
};

const getApprovedExhibitors = async (req, res, next) => {
  try {
    // Find approved applications for published events
    const applications = await Application.find({
      status: "approved",
    })
      .populate({
        path: "event",
        select: "title startDate endDate location status",
        match: { status: "published" },
      })
      .populate("exhibitor", "username email")
      .populate("booth", "boothNumber size price status")
      .sort({ createdAt: -1 });

    // Remove applications without published events or exhibitors
    const approvedApplications = applications.filter(
      (application) => application.event && application.exhibitor
    );

    // Get exhibitor IDs
    const exhibitorIds = approvedApplications.map(
      (application) => application.exhibitor._id
    );

    // Fetch exhibitor profiles
    const profiles = await ExhibitorProfile.find({
      exhibitor: { $in: exhibitorIds },
    }).select(
      "exhibitor companyName logoUrl description website productsServices address"
    );

    // Create profile lookup map
    const profileMap = new Map(
      profiles.map((profile) => [
        profile.exhibitor.toString(),
        profile,
      ])
    );

    // Combine application and profile data
    const exhibitors = approvedApplications.map((application) => {
      const profile = profileMap.get(
        application.exhibitor._id.toString()
      );

      return {
        _id: application._id,
        exhibitor: application.exhibitor,
        event: application.event,
        booth: application.booth,

        companyName:
          profile?.companyName || application.companyName,

        description:
          profile?.description || application.description,

        logoUrl: profile?.logoUrl || "",
        website: profile?.website || "",
        productsServices: profile?.productsServices || [],
        address: profile?.address || "",
      };
    });

    return res.status(200).json({
      success: true,
      count: exhibitors.length,
      exhibitors,
    });
  } catch (error) {
    console.error("Get Approved Exhibitors Error:", error);
    return next(error);
  }
};

const exhibitorController = {
  createApplication,
  getApplications,
  updateApplicationStatus,
  reservedBooth,
  getAllApplications,
  getMyApplications,
  assignBoothToApplication,
  getApprovedExhibitors,
};

export default exhibitorController;
