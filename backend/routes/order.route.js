import express from "express";
import * as OrderController from "../controllers/order.controller.js";
import { authGuard } from "../middlewares/auth.middleware.js";

const router = express.Router();

// /api/orders
router.post("/", authGuard, OrderController.createOrder);
router.get("/", authGuard, OrderController.getOrders);
router.get("/:id", authGuard, OrderController.getOrder);
router.patch("/:id/status", authGuard, OrderController.updateOrderStatus);
router.get("/qr/:qrToken", OrderController.getOrderByQrToken);
router.delete("/:id", authGuard, OrderController.cancelOrder);

export default router;



