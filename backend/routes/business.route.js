import express from "express";
import {
  getMe,
  updateProfile,
  deleteMe,
  changePassword,
} from "../controllers/business.controller.js";
import { authGuard, businessGuard } from "../middlewares/auth.middleware.js";
import { businessUpload } from "../middlewares/businessUpload.middleware.js";

const router = express.Router();

router.get("/me", authGuard, businessGuard, getMe);
router.patch("/me", authGuard, businessGuard, businessUpload, updateProfile);
router.patch("/me/password", authGuard, businessGuard, changePassword);
router.delete("/me", authGuard, businessGuard, deleteMe);

export default router;
