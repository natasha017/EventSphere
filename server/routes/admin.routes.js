import { Router } from "express";

import adminMiddleware from "../middlewares/admin.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

import adminController from "../controllers/admin.controller.js";
import { getDashboardStats } from "../controllers/admin.dashboard.controller.js";

const router = Router();

// Admin authentication
router.use(authMiddleware, adminMiddleware);

// Dashboard stats
router.get("/dashboard/stats", getDashboardStats);

// Events CRUD
router.route("/events")
  .post(upload.single("image"), adminController.createEvent)
  .get(adminController.getEvents);

router.route("/events/:id")
  .get(adminController.getEventById)
  .patch(upload.single("image"), adminController.updateEvent)
  .delete(adminController.deleteEvent);

export default router;