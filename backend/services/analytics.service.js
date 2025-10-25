import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import BaseError from "../errors/base.error.js";

const getBusinessAnalytics = async (businessId, period = "30d") => {
  if (!mongoose.Types.ObjectId.isValid(businessId)) {
    throw BaseError.BadRequestError("Invalid business id");
  }

  const now = new Date();
  let startDate;

  switch (period) {
    case "7d":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "30d":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "90d":
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  // Get orders for the period
  const orders = await Order.find({
    business: businessId,
    createdAt: { $gte: startDate },
  })
    .populate("product", "title category")
    .populate("user", "name")
    .exec();

  // Calculate metrics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const completedOrders = orders.filter((order) => order.status === "completed").length;
  const cancelledOrders = orders.filter((order) => order.status === "cancelled").length;
  const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

  // Get product performance
  const productStats = await Product.aggregate([
    { $match: { business: new mongoose.Types.ObjectId(businessId) } },
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "product",
        as: "orders",
      },
    },
    {
      $project: {
        title: 1,
        status: 1,
        stock: 1,
        originalPrice: 1,
        discountPrice: 1,
        orderCount: { $size: "$orders" },
        totalRevenue: {
          $sum: {
            $map: {
              input: "$orders",
              as: "order",
              in: "$$order.totalPrice",
            },
          },
        },
      },
    },
    { $sort: { orderCount: -1 } },
    { $limit: 10 },
  ]);

  // Get daily revenue for chart
  const dailyRevenue = await Order.aggregate([
    {
      $match: {
        business: new mongoose.Types.ObjectId(businessId),
        createdAt: { $gte: startDate },
        status: "completed",
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        revenue: { $sum: "$totalPrice" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Get category performance
  const categoryStats = await Order.aggregate([
    {
      $match: {
        business: new mongoose.Types.ObjectId(businessId),
        createdAt: { $gte: startDate },
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $lookup: {
        from: "categories",
        localField: "product.category",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
    {
      $group: {
        _id: "$category.name",
        orderCount: { $sum: 1 },
        revenue: { $sum: "$totalPrice" },
      },
    },
    { $sort: { orderCount: -1 } },
  ]);

  return {
    period,
    totalOrders,
    totalRevenue,
    completedOrders,
    cancelledOrders,
    completionRate,
    productStats,
    dailyRevenue,
    categoryStats,
  };
};

const getUserAnalytics = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw BaseError.BadRequestError("Invalid user id");
  }

  const orders = await Order.find({ user: userId })
    .populate("product", "title category")
    .populate("business", "name")
    .exec();

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const completedOrders = orders.filter((order) => order.status === "completed").length;
  const moneySaved = orders.reduce((sum, order) => {
    const originalPrice = order.product?.originalPrice || order.totalPrice;
    return sum + (originalPrice - order.totalPrice);
  }, 0);

  // Calculate environmental impact
  const foodWastePrevented = completedOrders * 0.5; // Estimate 0.5kg per order
  const co2Saved = foodWastePrevented * 2; // Standard 2x multiplier

  // Get favorite categories
  const categoryStats = await Order.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $lookup: {
        from: "categories",
        localField: "product.category",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
    {
      $group: {
        _id: "$category.name",
        orderCount: { $sum: 1 },
        totalSpent: { $sum: "$totalPrice" },
      },
    },
    { $sort: { orderCount: -1 } },
    { $limit: 5 },
  ]);

  return {
    totalOrders,
    totalSpent,
    completedOrders,
    moneySaved,
    foodWastePrevented,
    co2Saved,
    categoryStats,
  };
};

export default {
  getBusinessAnalytics,
  getUserAnalytics,
};



