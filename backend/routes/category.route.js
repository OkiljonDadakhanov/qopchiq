import express from "express";
import * as CategoryController from "../controllers/category.controller.js";

const router = express.Router();

// /api/categories
router.post("/", CategoryController.createCategory);
router.get("/", CategoryController.getCategories);
router.get("/:id", CategoryController.getCategory);
router.put("/:id", CategoryController.updateCategory);
router.delete("/:id", CategoryController.deleteCategory);

export default router;