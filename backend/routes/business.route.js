import express from "express";
import {
  getMe,
  updateProfile,
  deleteMe,
  changePassword,
} from "../controllers/business.controller.js";
import { authGuard } from "../middlewares/auth.middleware.js";
import { businessProfileUpload } from "../middlewares/businessUpload.middleware.js";

const router = express.Router();

// Business profil ma'lumotlari
router.get("/me", authGuard, getMe);

// Universal profil yangilash (text fieldlar + avatar + hujjatlar + location)
router.patch("/me", authGuard, businessProfileUpload, updateProfile);

// Parol o'zgartirish
router.patch("/me/password", authGuard, changePassword);

// Profil o'chirish
router.delete("/me", authGuard, deleteMe);

export default router;
