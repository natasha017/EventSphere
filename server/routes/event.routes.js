import { Router } from "express";
import adminController from "../controllers/admin.controller.js";

const router = Router();

router.get(
  "/published",
  adminController.getPublishedEvents
);
router
.get("/:eventId",adminController.getPublicEventById);

export default router;