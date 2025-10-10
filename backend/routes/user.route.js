import { Router } from "express";
import authGuard from "../middlewares/auth.middleware.js";
import { getMe, updateProfile, updateField, deleteMe, updateAvatar } from "../controllers/user.controller.js";
import multer from "multer";

const router = Router();
const upload = multer();

router.get("/me", authGuard, getMe);
router.patch("/me", authGuard, updateProfile);
router.patch("/me/:key", authGuard, updateField);
router.delete("/me", authGuard, deleteMe);
router.patch("/me/avatar", authGuard, upload.single("file"), updateAvatar);

export default router;


