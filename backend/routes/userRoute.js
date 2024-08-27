import express from "express";
import {
  Signup,
  Login,
  Logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/check-auth", protect, checkAuth);
router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
