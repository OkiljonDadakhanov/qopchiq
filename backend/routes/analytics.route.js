import express from "express";
import * as AnalyticsController from "../controllers/analytics.controller.js";
import { authGuard } from "../middlewares/auth.middleware.js";

const router = express.Router();

// /api/analytics
router.get("/business", authGuard, AnalyticsController.getBusinessAnalytics);
router.get("/user", authGuard, AnalyticsController.getUserAnalytics);

export default router;



