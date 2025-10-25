import express from "express";
import {
        getMe,
        updateProfile,
        updateField,
        updateAvatar,
        removeAvatar,
        updateLocation,
        addDocument,
        removeDocument,
        deleteMe,
        changePassword,
        listBranches,
        createBranch,
        updateBranch,
        removeBranch,
} from "../controllers/business.controller.js";
import { authGuard, businessGuard } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", authGuard, businessGuard, getMe);
router.patch("/me", authGuard, businessGuard, updateProfile);
router.patch("/me/:key", authGuard, businessGuard, updateField);
router.patch("/me/avatar", authGuard, businessGuard, updateAvatar);
router.delete("/me/avatar", authGuard, businessGuard, removeAvatar);
router.patch("/me/location", authGuard, businessGuard, updateLocation);
router.post("/me/documents", authGuard, businessGuard, addDocument);
router.delete("/me/documents/:fileId", authGuard, businessGuard, removeDocument);
router.patch("/me/password", authGuard, businessGuard, changePassword);
router.delete("/me", authGuard, businessGuard, deleteMe);

router.get("/me/branches", authGuard, businessGuard, listBranches);
router.post("/me/branches", authGuard, businessGuard, createBranch);
router.patch("/me/branches/:branchId", authGuard, businessGuard, updateBranch);
router.delete("/me/branches/:branchId", authGuard, businessGuard, removeBranch);

export default router;
