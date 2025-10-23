import express from "express";
import * as ProductController from "../controllers/product.controller.js";
import upload from "../middlewares/upload.middleware.js";
import { authGuard, businessGuard } from "../middlewares/auth.middleware.js";

const router = express.Router();

// /api/products
router.post("/", authGuard, businessGuard, upload.array("images", 10), ProductController.createProduct);
router.get("/", ProductController.getProducts);
router.get("/business/me", authGuard, businessGuard, ProductController.getMyProducts);
router.get("/business/:businessId", ProductController.getProductsByBusiness);
router.get("/:id", ProductController.getProduct);
router.put(
        "/:id",
        authGuard,
        businessGuard,
        upload.array("images", 10),
        ProductController.updateProduct
);
router.patch(
        "/:id/status",
        authGuard,
        businessGuard,
        ProductController.updateProductStatus
);
router.delete("/:id", authGuard, businessGuard, ProductController.deleteProduct);

export default router;
