import express from "express";
import * as ProductController from "../controllers/product.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// /api/products
// accept up to 10 images via multipart/form-data field name 'images'
router.post("/", upload.array('images', 10), ProductController.createProduct);
router.get("/", ProductController.getProducts);
router.get("/business/:businessId", ProductController.getProductsByBusiness);
router.get("/:id", ProductController.getProduct);
router.put("/:id", upload.array('images', 10), ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);
export default router;