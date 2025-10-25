import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import NotificationService from "./notification.service.js";
import BaseError from "../errors/base.error.js";

const create = async (data) => {
  if (!data.product || !mongoose.Types.ObjectId.isValid(data.product)) {
    throw BaseError.BadRequestError("Valid product id is required");
  }

  if (!data.user || !mongoose.Types.ObjectId.isValid(data.user)) {
    throw BaseError.BadRequestError("Valid user id is required");
  }

  if (!data.quantity || data.quantity <= 0) {
    throw BaseError.BadRequestError("Quantity must be greater than zero");
  }

  if (!data.totalPrice || data.totalPrice <= 0) {
    throw BaseError.BadRequestError("Total price must be greater than zero");
  }

  // Get product details
  const product = await Product.findById(data.product).populate("business");
  if (!product) {
    throw BaseError.NotFoundError("Product not found");
  }

  if (product.status !== "available") {
    throw BaseError.BadRequestError("Product is not available for ordering");
  }

  if (product.stock < data.quantity) {
    throw BaseError.BadRequestError("Insufficient stock available");
  }

  // Create order
  const orderData = {
    product: data.product,
    business: product.business._id,
    user: data.user,
    quantity: data.quantity,
    totalPrice: data.totalPrice,
    notes: data.notes,
  };

  const order = new Order(orderData);
  const savedOrder = await order.save();

  // Populate the order for notification
  const populatedOrder = await Order.findById(savedOrder._id)
    .populate("product", "title")
    .populate("business", "name")
    .populate("user", "name")
    .exec();

  // Create initial notification
  await NotificationService.createOrderNotification(populatedOrder, "order_confirmed");

  return savedOrder;
};

const getAll = async (query = {}) => {
  const page = parseInt(query.page) || 1;
  const limit = Math.min(parseInt(query.limit) || 50, 200);
  const filter = {};

  if (query.user && mongoose.Types.ObjectId.isValid(query.user)) {
    filter.user = query.user;
  }

  if (query.business && mongoose.Types.ObjectId.isValid(query.business)) {
    filter.business = query.business;
  }

  if (query.status) {
    filter.status = query.status;
  }

  return await Order.find(filter)
    .populate("product", "title images originalPrice discountPrice")
    .populate("business", "name avatar address")
    .populate("user", "name email")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .exec();
};

const getById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Order.findById(id)
    .populate("product")
    .populate("business", "name avatar address")
    .populate("user", "name email")
    .exec();
};

const updateStatus = async (id, status, businessId = null) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw BaseError.BadRequestError("Invalid order id");
  }

  const filter = { _id: id };
  if (businessId) {
    filter.business = businessId;
  }

  const order = await Order.findOneAndUpdate(
    filter,
    { status, updatedAt: new Date() },
    { new: true }
  )
    .populate("product")
    .populate("business", "name avatar address")
    .populate("user", "name email")
    .exec();

  if (!order) {
    throw BaseError.NotFoundError("Order not found");
  }

  // Create notification for status change
  if (status === "ready") {
    await NotificationService.createOrderNotification(order, "order_ready");
  } else if (status === "completed") {
    await NotificationService.createOrderNotification(order, "order_completed");
  } else if (status === "cancelled") {
    await NotificationService.createOrderNotification(order, "order_cancelled");
  }

  return order;
};

const getByUser = async (userId, query = {}) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return [];
  const page = parseInt(query.page) || 1;
  const limit = Math.min(parseInt(query.limit) || 50, 200);
  const filter = { user: userId };

  if (query.status) filter.status = query.status;

  return await Order.find(filter)
    .populate("product", "title images originalPrice discountPrice")
    .populate("business", "name avatar address")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .exec();
};

const getByBusiness = async (businessId, query = {}) => {
  if (!mongoose.Types.ObjectId.isValid(businessId)) return [];
  const page = parseInt(query.page) || 1;
  const limit = Math.min(parseInt(query.limit) || 50, 200);
  const filter = { business: businessId };

  if (query.status) filter.status = query.status;

  return await Order.find(filter)
    .populate("product", "title images originalPrice discountPrice")
    .populate("user", "name email")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .exec();
};

const getByQrToken = async (qrToken) => {
  return await Order.findOne({ qrToken })
    .populate("product")
    .populate("business", "name avatar address")
    .populate("user", "name email")
    .exec();
};

const remove = async (id, userId = null) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw BaseError.BadRequestError("Invalid order id");
  }

  const filter = { _id: id };
  if (userId) {
    filter.user = userId;
  }

  const order = await Order.findOneAndDelete(filter).exec();
  if (!order) {
    throw BaseError.NotFoundError("Order not found");
  }

  return order;
};

export default {
  create,
  getAll,
  getById,
  updateStatus,
  getByUser,
  getByBusiness,
  getByQrToken,
  remove,
};
