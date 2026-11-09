import Event from "../models/event.model.js";
import fs from "fs";
import path from "path";

const getEventFilter = (req, id = null) => {
  const filter =
    req.user.role === "admin"
      ? {}
      : {
          createdBy: req.user._id,
        };

  if (id) {
    filter._id = id;
  }

  return filter;
};
const allowedFields = [
  "title",
  "description",
  "theme",
  "location",
  "startDate",
  "endDate",
  "status",
];

const deleteImage = (imagePath) => {
  if (!imagePath) return;

  const filename = path.basename(imagePath);
  const absolutePath = path.join(
    process.cwd(),
    "uploads",
    "events",
    filename
  );

  fs.unlink(absolutePath, (err) => {
    if (err && err.code !== "ENOENT") {
      console.log("Failed to delete image:", err.message);
    }
  });
};

const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      theme,
      location,
      startDate,
      endDate,
      status,
    } = req.body;

    if (
      !title ||
      !description ||
      !theme ||
      !location ||
      !startDate ||
      !endDate ||
      !status
    ) {
      if (req.file) deleteImage(req.file.filename);

      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const event = await Event.create({
      title,
      description,
      theme,
      location,
      startDate,
      endDate,
      status,
      createdBy: req.user._id,
      image: req.file
        ? `/uploads/events/${req.file.filename}`
        : "",
    });

    return res.status(201).json({
      success: true,
      message: "Expo created successfully",
      event,
    });
  } catch (error) {
    if (req.file) deleteImage(req.file.filename);
    next(error);
  }
};

const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find(
      getEventFilter(req)
    ).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    next(error);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findOne(
      getEventFilter(req, req.params.id)
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Expo not found",
      });
    }

    return res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const filter = getEventFilter(req, req.params.id);

    const existingEvent = await Event.findOne(filter);

    if (!existingEvent) {
      if (req.file) deleteImage(req.file.filename);

      return res.status(404).json({
        success: false,
        message: "Expo not found",
      });
    }

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (req.file) {
      updates.image = `/uploads/events/${req.file.filename}`;
    }

    const event = await Event.findOneAndUpdate(
      filter,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

 
    if (req.file && existingEvent.image) {
      deleteImage(existingEvent.image);
    }

    return res.status(200).json({
      success: true,
      message: "Expo updated successfully",
      event,
    });
  } catch (error) {
    if (req.file) deleteImage(req.file.filename);
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const filter = getEventFilter(req, req.params.id);

    const event = await Event.findOneAndDelete(filter);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Expo not found",
      });
    }

    if (event.image) {
      deleteImage(event.image);
    }

    return res.status(200).json({
      success: true,
      message: "Expo deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getPublishedEvents = async (req, res, next) => {
  try {
    const events = await Event.find({
      status: "published",
    }).sort({ startDate: 1 });

    return res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    next(error);
  }
};

const getPublicEventById = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findOne({
      _id: eventId,
      status: "published",
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Expo not found or is currently not published",
      });
    }

    return res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    next(error);
  }
};

const adminController = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getPublishedEvents,
  getPublicEventById,
};

export default adminController;
