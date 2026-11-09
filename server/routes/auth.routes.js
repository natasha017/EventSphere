import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import validate from "../middlewares/validate.middleware.js";
import authValidator from "../validator/auth.validator.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router=Router()


router
.route("/register")
.post(validate(authValidator.registerSchema),authController.register)
router
.route("/login")
.post(validate(authValidator.loginSchema),authController.login)

router
.route("/logout")
.post(authController.logout)

router
.route("/forgot-password")
.post(authController.forgotPassword );

router
.route("/reset-password/:token")
.patch(authController.resetPassword);

router
.route("/user")
.get(authMiddleware,authController.getUserData)

export default router