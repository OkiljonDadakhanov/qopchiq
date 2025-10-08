import { Router } from "express";
import authGuard from "../middlewares/auth.middleware.js";
import { getMe, updateProfile, updateField, deleteMe } from "../controllers/user.controller.js";

const router = Router();

router.get("/me", authGuard, getMe);
router.patch("/me", authGuard, updateProfile);
router.patch("/me/:key", authGuard, updateField);
router.delete("/me", authGuard, deleteMe);

export default router;


