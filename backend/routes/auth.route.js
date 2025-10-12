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
  businessLogin,
} from "../controllers/auth.controller.js";

const router = Router();

// User Auth
router.post("/signup", signup);
router.post("/login", login);

// Business Auth
router.post("/business/signup", businessSignup);
router.post("/business/login", businessLogin);

// Common Auth
router.post("/logout", logout);
router.post("/refresh", refresh);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/resend-verification", resendVerification);

export default router;