import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

import sessionController from "../controllers/session.controller.js";

const router = express.Router();

// PUBLIC: Get sessions of published events
router.get(
  "/:eventId/sessions",
  sessionController.getSessions
);

// ADMIN: Get all sessions of own event
router.get(
  "/:eventId/admin-sessions",
  authMiddleware,
  adminMiddleware,
  sessionController.getAdminSessions
);

// ADMIN: Create session
router.post(
  "/:eventId/sessions",
  authMiddleware,
  adminMiddleware,
  sessionController.createSession
);

// ADMIN: Update session
router.patch(
  "/:eventId/sessions/:sessionId",
  authMiddleware,
  adminMiddleware,
  sessionController.updateSession
);

// ADMIN: Delete session
router.delete(
  "/:eventId/sessions/:sessionId",
  authMiddleware,
  adminMiddleware,
  sessionController.deleteSession
);

export default router;