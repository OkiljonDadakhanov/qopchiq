import express from "express";
import {
  getMe,
  updateProfile,
  deleteMe,
} from "../controllers/user.controller.js";
import { authGuard } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

// Profil ma'lumotlari
router.get("/me", authGuard, getMe);

// Universal profil yangilash (text fieldlar + avatar fayl)
router.patch("/me", authGuard, upload.single("avatar"), updateProfile);

// Profil o'chirish
router.delete("/me", authGuard, deleteMe);

export default router;
