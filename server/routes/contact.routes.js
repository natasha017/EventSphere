import { Router } from "express";
import contactController from "../controllers/contact.controller.js";
import validate from "../middlewares/validate.middleware.js";
import contactSchema from "../validator/contact.validator.js";
const router=Router()

router
.route("/contact")
.post(validate(contactSchema),contactController)
export default router