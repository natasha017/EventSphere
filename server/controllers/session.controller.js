
import Event from "../models/event.model.js";
import Session from "../models/session.model.js";
import validateObjectId from "../utils/validateObjectId.js";

// Check whether session dates fall within event dates
const isWithinEventDates = (start, end, event) => {
    const sessionStartDate = start.toISOString().slice(0, 10);
    const sessionEndDate = end.toISOString().slice(0, 10);

    const eventStartDate = new Date(event.startDate)
        .toISOString().slice(0, 10);

    const eventEndDate = new Date(event.endDate)
        .toISOString().slice(0, 10);

    return (
        sessionStartDate >= eventStartDate &&
        sessionEndDate <= eventEndDate
    );
};

// CREATE SESSION
const createSession = async (req, res, next) => {
    try {
        if (!validateObjectId(req.params.eventId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid event ID",
            });
        }

        const { title, description, startTime, endTime } = req.body;

        if (!title || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: "Title, start time, and end time are required",
            });
        }

        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid session title",
            });
        }

        const start = new Date(startTime);
        const end = new Date(endTime);

        if (
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime()) ||
            end <= start
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid times. End time must be after start time",
            });
        }

        const event = await Event.findOne({
            _id: req.params.eventId,
            createdBy: req.user._id,
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found or access denied",
            });
        }

        if (!isWithinEventDates(start, end, event)) {
            return res.status(400).json({
                success: false,
                message: "Session must be scheduled within event dates",
            });
        }

        const session = await Session.create({
            event: event._id,
            title: title.trim(),
            description,
            startTime: start,
            endTime: end,
        });

        return res.status(201).json({
            success: true,
            message: "Session created successfully",
            session,
        });

    } catch (error) {
        next(error);
    }
};

// GET PUBLIC EVENT SESSIONS
const getSessions = async (req, res, next) => {
    try {
        if (!validateObjectId(req.params.eventId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid event ID",
            });
        }

        const event = await Event.findOne({
            _id: req.params.eventId,
            status: "published",
        }).select(
            "title image description theme location startDate endDate status"
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Published event not found",
            });
        }

        const sessions = await Session.find({
            event: event._id,
        }).sort({ startTime: 1 });

        return res.status(200).json({
            success: true,
            event,
            total: sessions.length,
            sessions,
        });

    } catch (error) {
        next(error);
    }
};

// UPDATE SESSION
const updateSession = async (req, res, next) => {
    try {
        if (
            !validateObjectId(req.params.eventId) ||
            !validateObjectId(req.params.sessionId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid event or session ID",
            });
        }

        const event = await Event.findOne({
            _id: req.params.eventId,
            createdBy: req.user._id,
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found or access denied",
            });
        }

        const session = await Session.findOne({
            _id: req.params.sessionId,
            event: event._id,
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found",
            });
        }

        const { title, description, startTime, endTime } = req.body;

        const start = startTime !== undefined
            ? new Date(startTime)
            : session.startTime;

        const end = endTime !== undefined
            ? new Date(endTime)
            : session.endTime;

        if (
            (startTime !== undefined && Number.isNaN(start.getTime())) ||
            (endTime !== undefined && Number.isNaN(end.getTime()))
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid date and time values",
            });
        }

        if (end <= start) {
            return res.status(400).json({
                success: false,
                message: "End time must be after start time",
            });
        }

        if (!isWithinEventDates(start, end, event)) {
            return res.status(400).json({
                success: false,
                message: "Session must be scheduled within event dates",
            });
        }

        if (title !== undefined) {
            if (typeof title !== "string" || !title.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Title cannot be empty",
                });
            }

            session.title = title.trim();
        }

        if (description !== undefined) {
            if (typeof description !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Description must be a string",
                });
            }

            session.description = description;
        }

        if (startTime !== undefined) {
            session.startTime = start;
        }

        if (endTime !== undefined) {
            session.endTime = end;
        }

        await session.save();

        return res.status(200).json({
            success: true,
            message: "Session updated successfully",
            session,
        });

    } catch (error) {
        next(error);
    }
};
// GET ADMIN EVENT SESSIONS
const getAdminSessions = async (req, res, next) => {
    try {
        if (!validateObjectId(req.params.eventId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid event ID",
            });
        }

        const event = await Event.findOne({
            _id: req.params.eventId,
            createdBy: req.user._id,
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found or access denied",
            });
        }

        const sessions = await Session.find({
            event: event._id,
        }).sort({ startTime: 1 });

        return res.status(200).json({
            success: true,
            event,
            total: sessions.length,
            sessions,
        });
    } catch (error) {
        next(error);
    }
};

// DELETE SESSION
const deleteSession = async (req, res, next) => {
    try {
        if (
            !validateObjectId(req.params.eventId) ||
            !validateObjectId(req.params.sessionId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid event or session ID",
            });
        }

        const event = await Event.findOne({
            _id: req.params.eventId,
            createdBy: req.user._id,
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found or access denied",
            });
        }

        const session = await Session.findOneAndDelete({
            _id: req.params.sessionId,
            event: event._id,
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Session deleted successfully",
        });

    } catch (error) {
        next(error);
    }
};

const sessionController = {
    createSession,
    getSessions,
    getAdminSessions,
    updateSession,
    deleteSession,
};

export default sessionController;
