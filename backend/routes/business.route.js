import express from "express";
import {
	getMe,
	updateProfile,
	updateField,
	updateLocation,
	addDocument,
	removeDocument,
	deleteMe,
	changePassword
} from "../controllers/business.controller.js";
import { authGuard } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// Business profil ma'lumotlari
router.get("/me", authGuard, getMe);

// Profil yangilash (avatar file bilan birga)
router.patch("/me", authGuard, upload.single("avatar"), updateProfile);
router.patch("/me/:key", authGuard, updateField);

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

