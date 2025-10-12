import express from "express";
import { getMe, updateProfile, updateField, deleteMe } from "../controllers/user.controller.js";
import { authGuard } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// Profil ma'lumotlari
router.get("/me", authGuard, getMe);

// Profil yangilash (avatar file bilan birga)
router.patch("/me", authGuard, upload.single("avatar"), updateProfile);

// Boshqa field'lar yangilash
router.patch("/me/:key", authGuard, updateField);

// Profil o'chirish
router.delete("/me", authGuard, deleteMe);

export default router;


