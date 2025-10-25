import NotificationService from "../services/notification.service.js";
import BaseError from "../errors/base.error.js";

export const getNotifications = async (req, res, next) => {
  try {
    if (req.userType !== "user") {
      throw BaseError.ForbiddenError("Only users can view notifications");
    }

    const notifications = await NotificationService.getByUser(req.userId, req.query);
    return res.json({ success: true, notifications });
  } catch (error) {
    return next(error);
  }
};

export const markNotificationAsRead = async (req, res, next) => {
  try {
    if (req.userType !== "user") {
      throw BaseError.ForbiddenError("Only users can mark notifications as read");
    }

    const notification = await NotificationService.markAsRead(req.params.id, req.userId);
    return res.json({ success: true, notification });
  } catch (error) {
    return next(error);
  }
};

export const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    if (req.userType !== "user") {
      throw BaseError.ForbiddenError("Only users can mark notifications as read");
    }

    await NotificationService.markAllAsRead(req.userId);
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};

export const getUnreadCount = async (req, res, next) => {
  try {
    if (req.userType !== "user") {
      throw BaseError.ForbiddenError("Only users can get notification count");
    }

    const count = await NotificationService.getUnreadCount(req.userId);
    return res.json({ success: true, count });
  } catch (error) {
    return next(error);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    if (req.userType !== "user") {
      throw BaseError.ForbiddenError("Only users can delete notifications");
    }

    await NotificationService.remove(req.params.id, req.userId);
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};



