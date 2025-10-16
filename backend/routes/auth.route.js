import { Router } from "express";
import {
  signup,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refresh,
  resendVerification,
  businessSignup,
} from "../controllers/auth.controller.js";

const router = Router();

// Auth
router.post("/signup", signup);
// business signup (separate endpoint expected by frontend)
router.post("/business/signup", businessSignup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refresh);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/resend-verification", resendVerification);

export default router;