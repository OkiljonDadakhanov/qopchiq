import express from "express";
import {
	getMe,
	updateProfile,
	updateField,
	updateAvatar,
	updateLocation,
	addDocument,
	removeDocument,
	deleteMe,
	changePassword
} from "../controllers/business.controller.js";
import { authGuard } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Business profil ma'lumotlari
router.get("/me", authGuard, getMe);

// Profil yangilash
router.patch("/me", authGuard, updateProfile);
router.patch("/me/:key", authGuard, updateField);

// Avatar yangilash (URL bilan)
router.patch("/me/avatar", authGuard, updateAvatar);

// Location yangilash
router.patch("/me/location", authGuard, updateLocation);

// Hujjatlar boshqaruvi
router.post("/me/documents", authGuard, addDocument);
router.delete("/me/documents/:fileId", authGuard, removeDocument);

// Parol o'zgartirish
router.patch("/me/password", authGuard, changePassword);

// Profil o'chirish
router.delete("/me", authGuard, deleteMe);

export default router;

