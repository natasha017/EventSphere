import { Router } from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import exhibitorMiddleware from "../middlewares/exhibitor.middleware.js";

import boothController from "../controllers/booth.controller.js";

const router = Router();

router.use(authMiddleware);

// Admin routes
router.post(
  "/events/:eventId/booths",
  adminMiddleware,
  boothController.createBooth
);

router.get(
  "/events/:eventId/booths",
  adminMiddleware,
  boothController.getBooths
);

router.patch(
  "/events/:eventId/booths/:boothId",
  adminMiddleware,
  boothController.updateBooth
);

router.delete(
  "/events/:eventId/booths/:boothId",
  adminMiddleware,
  boothController.deleteBooth
);

// Exhibitor routes
router.get(
  "/events/:eventId/booths/available",
  exhibitorMiddleware,
  boothController.getAvailableBooths
);

router.post(
  "/events/:eventId/booths/:boothId/reserve",
  exhibitorMiddleware,
  boothController.reserveBooth
);

export default router;