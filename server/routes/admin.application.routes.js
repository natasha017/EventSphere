
import { Router } from "express";
import exhibitorController from "../controllers/exhibitor.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddelware from "../middlewares/admin.middleware.js";

const router = Router();

router.get(
  "/applications",
  authMiddleware,
  adminMiddelware,
  exhibitorController.getAllApplications
);


router.get(
  "/events/:eventId/applications",
  authMiddleware,
  adminMiddelware,
  exhibitorController.getApplications
);
router.patch(
  "/events/:eventId/applications/:applicationId",
  authMiddleware,
  adminMiddelware,
  exhibitorController.updateApplicationStatus
);


router.patch(
  "/events/:eventId/applications/:applicationId/assign-booth",
  authMiddleware,
  adminMiddelware,
  exhibitorController.assignBoothToApplication
);

export default router;
