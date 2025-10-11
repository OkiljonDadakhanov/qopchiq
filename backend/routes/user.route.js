import express from "express";
import { getMe, updateProfile, updateField, updateAvatar, deleteMe } from "../controllers/user.controller.js";
import { authGuard } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Profil ma'lumotlari
router.get("/me", authGuard, getMe);

// Profil yangilash
router.patch("/me", authGuard, updateProfile);
router.patch("/me/:key", authGuard, updateField);

// Avatar yangilash (URL bilan)
router.patch("/me/avatar", authGuard, updateAvatar);

// Profil o'chirish
router.delete("/me", authGuard, deleteMe);

export default router;


