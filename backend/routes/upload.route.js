import express from "express";
import { uploadFile, deleteFile } from "../controllers/upload.controller.js";
import { authGuard } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// Fayl yuklash
router.post("/upload", authGuard, upload.single("file"), uploadFile);

// Fayl o'chirish
router.delete("/file/:fileId", authGuard, deleteFile);

export default router;
