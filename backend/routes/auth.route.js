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
  businessVerifyEmail,
  businessResendVerification,
} from "../controllers/auth.controller.js";

const router = Router();

// User Auth
router.post("/signup", signup);
router.post("/login", login);
// business auth (separate endpoints expected by frontend)
router.post("/business/signup", businessSignup);
router.post("/business/login", businessLogin);
router.post("/business/verify-email", businessVerifyEmail);
router.post("/business/resend-verification", businessResendVerification);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/resend-verification", resendVerification);

export default router;
