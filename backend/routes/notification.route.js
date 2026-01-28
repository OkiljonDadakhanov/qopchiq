import express from "express";
import * as NotificationController from "../controllers/notification.controller.js";
import { authGuard } from "../middlewares/auth.middleware.js";

const router = express.Router();

// /api/notifications
router.get("/", authGuard, NotificationController.getNotifications);
router.get("/unread-count", authGuard, NotificationController.getUnreadCount);
router.patch("/:id/read", authGuard, NotificationController.markNotificationAsRead);
router.patch("/mark-all-read", authGuard, NotificationController.markAllNotificationsAsRead);
router.delete("/:id", authGuard, NotificationController.deleteNotification);

export default router;




