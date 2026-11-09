import { Router } from "express";

import exhibitorController from "../controllers/exhibitor.controller.js";
import exhibitorProfileController from "../controllers/exhibitorProfile.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import exhibitorMiddleware from "../middlewares/exhibitor.middleware.js";
import exhibitorDashboardController from "../controllers/exhibitor.dashboard.controller.js";

const router = Router();

// Public directory
router.get(
  "/directory",
  exhibitorController.getApprovedExhibitors
);

// Apply for event
router.post(
  "/:eventId/applications",
  authMiddleware,
  exhibitorMiddleware,
  exhibitorController.createApplication
);

router.get(
  "/dashboard/stats",
  authMiddleware,
  exhibitorMiddleware,
  exhibitorDashboardController.getDashboardStats
);

// Get profile
router.get(
  "/profile",
  authMiddleware,
  exhibitorMiddleware,
  exhibitorProfileController.getMyProfile
);

// Update profile
router.patch(
  "/profile",
  authMiddleware,
  exhibitorMiddleware,
  exhibitorProfileController.updateMyProfile
);

// My applications
router.get(
  "/my-applications",
  authMiddleware,
  exhibitorMiddleware,
  exhibitorController.getMyApplications
);

export default router;