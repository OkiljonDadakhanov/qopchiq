import mongoose from "mongoose";
import Product from "../models/product.model.js";
import BaseError from "../errors/base.error.js";

const searchProducts = async (query = {}) => {
  const page = parseInt(query.page) || 1;
  const limit = Math.min(parseInt(query.limit) || 50, 200);
  const filter = { status: "available" };

  // Text search
  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
    ];
  }

  // Category filter
  if (query.category && mongoose.Types.ObjectId.isValid(query.category)) {
    filter.category = query.category;
  }

  // Business filter
  if (query.business && mongoose.Types.ObjectId.isValid(query.business)) {
    filter.business = query.business;
  }

  // Price range filter
  if (query.minPrice || query.maxPrice) {
    filter.discountPrice = {};
    if (query.minPrice) filter.discountPrice.$gte = parseFloat(query.minPrice);
    if (query.maxPrice) filter.discountPrice.$lte = parseFloat(query.maxPrice);
  }

  // Distance filter (requires location data)
  if (query.lat && query.lng && query.radius) {
    // This would require geospatial indexing
    // For now, we'll skip distance filtering
  }

  // Sort options
  let sort = { createdAt: -1 };
  if (query.sort === "price_asc") sort = { discountPrice: 1 };
  if (query.sort === "price_desc") sort = { discountPrice: -1 };
  if (query.sort === "newest") sort = { createdAt: -1 };
  if (query.sort === "oldest") sort = { createdAt: 1 };

  return await Product.find(filter)
    .populate("category", "name")
    .populate("business", "name avatar address")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort(sort)
    .exec();
};

const getSearchSuggestions = async (query) => {
  if (!query || query.length < 2) return [];

  const suggestions = await Product.aggregate([
    {
      $match: {
        status: "available",
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      },
    },
    {
      $group: {
        _id: "$title",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 10,
    },
  ]);

  return suggestions.map((s) => s._id);
};

const getPopularCategories = async () => {
  return await Product.aggregate([
    {
      $match: { status: "available" },
    },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "categoryInfo",
      },
    },
    {
      $unwind: "$categoryInfo",
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 10,
    },
    {
      $project: {
        _id: "$_id",
        name: "$categoryInfo.name",
        count: 1,
      },
    },
  ]);
};

const getNearbyBusinesses = async (lat, lng, radius = 10) => {
  // This would require geospatial data and indexing
  // For now, return all businesses
  return await Product.distinct("business");
};

export default {
  searchProducts,
  getSearchSuggestions,
  getPopularCategories,
  getNearbyBusinesses,
};




