import mongoose from "mongoose";
import Notification from "../models/notification.model.js";
import BaseError from "../errors/base.error.js";

const create = async (data) => {
  if (!data.user || !mongoose.Types.ObjectId.isValid(data.user)) {
    throw BaseError.BadRequestError("Valid user id is required");
  }

  if (!data.type || !data.title || !data.message) {
    throw BaseError.BadRequestError("Type, title, and message are required");
  }

  const notification = new Notification(data);
  return await notification.save();
};

const getByUser = async (userId, query = {}) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return [];
  const page = parseInt(query.page) || 1;
  const limit = Math.min(parseInt(query.limit) || 50, 200);
  const filter = { user: userId };

  if (query.isRead !== undefined) {
    filter.isRead = query.isRead === "true";
  }

  if (query.type) {
    filter.type = query.type;
  }

  return await Notification.find(filter)
    .populate("order", "qrToken status totalPrice")
    .populate("business", "name avatar")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .exec();
};

const markAsRead = async (notificationId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    throw BaseError.BadRequestError("Invalid notification id");
  }

  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    throw BaseError.NotFoundError("Notification not found");
  }

  return notification;
};

const markAllAsRead = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw BaseError.BadRequestError("Invalid user id");
  }

  return await Notification.updateMany(
    { user: userId, isRead: false },
    { isRead: true }
  );
};

const getUnreadCount = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return 0;
  return await Notification.countDocuments({ user: userId, isRead: false });
};

const remove = async (notificationId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    throw BaseError.BadRequestError("Invalid notification id");
  }

  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    user: userId,
  });

  if (!notification) {
    throw BaseError.NotFoundError("Notification not found");
  }

  return notification;
};

// Helper function to create order notifications
const createOrderNotification = async (order, type) => {
  const notifications = {
    order_confirmed: {
      title: "Order Confirmed! 🎉",
      message: `Your order for ${order.product?.title} has been confirmed by ${order.business?.name}`,
    },
    order_ready: {
      title: "Order Ready for Pickup! 📦",
      message: `Your order is ready for pickup at ${order.business?.name}`,
    },
    order_completed: {
      title: "Order Completed! ✅",
      message: `Thank you for your order! You've helped reduce food waste.`,
    },
    order_cancelled: {
      title: "Order Cancelled",
      message: `Your order has been cancelled. If you have any questions, please contact us.`,
    },
  };

  const notificationData = notifications[type];
  if (!notificationData) return null;

  return await create({
    user: order.user,
    business: order.business,
    order: order._id,
    type,
    title: notificationData.title,
    message: notificationData.message,
    data: {
      orderId: order._id,
      qrToken: order.qrToken,
      totalPrice: order.totalPrice,
    },
  });
};

export default {
  create,
  getByUser,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  remove,
  createOrderNotification,
};



