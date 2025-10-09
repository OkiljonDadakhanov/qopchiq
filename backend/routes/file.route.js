import { Router } from "express";
import multer from "multer";
import { uploadFile, deleteFile } from "../controllers/file.controller.js";

const router = Router();
const upload = multer();

router.post("/upload", upload.single("file"), uploadFile);
router.delete("/:id", deleteFile);

export default router;
