import express from "express";
import {
	getMe,
	updateProfile,
	updateField,
	removeDocument,
	deleteMe,
	changePassword
} from "../controllers/business.controller.js";
import { authGuard } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// Business profil ma'lumotlari
router.get("/me", authGuard, getMe);

// Profil yangilash (avatar, location, documents bilan birga)
router.patch("/me", authGuard, upload.fields([
	{ name: "avatar", maxCount: 1 },
	{ name: "documents", maxCount: 10 }
]), updateProfile);

// Boshqa field'lar yangilash
router.patch("/me/:key", authGuard, updateField);

// Hujjat o'chirish
router.delete("/me/documents/:fileId", authGuard, removeDocument);

// Parol o'zgartirish
router.patch("/me/password", authGuard, changePassword);

// Profil o'chirish
router.delete("/me", authGuard, deleteMe);

export default router;

