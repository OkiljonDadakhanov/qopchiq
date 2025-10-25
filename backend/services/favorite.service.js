import mongoose from "mongoose";
import Favorite from "../models/favorite.model.js";
import BaseError from "../errors/base.error.js";

const add = async (userId, productId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw BaseError.BadRequestError("Invalid user id");
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw BaseError.BadRequestError("Invalid product id");
  }

  // Check if already exists
  const existing = await Favorite.findOne({ user: userId, product: productId });
  if (existing) {
    throw BaseError.BadRequestError("Product already in favorites");
  }

  const favorite = new Favorite({ user: userId, product: productId });
  return await favorite.save();
};

const remove = async (userId, productId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw BaseError.BadRequestError("Invalid user id");
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw BaseError.BadRequestError("Invalid product id");
  }

  const favorite = await Favorite.findOneAndDelete({ user: userId, product: productId });
  if (!favorite) {
    throw BaseError.NotFoundError("Favorite not found");
  }

  return favorite;
};

const getByUser = async (userId, query = {}) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return [];
  const page = parseInt(query.page) || 1;
  const limit = Math.min(parseInt(query.limit) || 50, 200);

  return await Favorite.find({ user: userId })
    .populate({
      path: "product",
      populate: {
        path: "business",
        select: "name avatar address",
      },
    })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .exec();
};

const isFavorite = async (userId, productId) => {
  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
    return false;
  }

  const favorite = await Favorite.findOne({ user: userId, product: productId });
  return !!favorite;
};

const toggle = async (userId, productId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw BaseError.BadRequestError("Invalid user id");
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw BaseError.BadRequestError("Invalid product id");
  }

  const existing = await Favorite.findOne({ user: userId, product: productId });
  
  if (existing) {
    await Favorite.findOneAndDelete({ user: userId, product: productId });
    return { isFavorite: false };
  } else {
    const favorite = new Favorite({ user: userId, product: productId });
    await favorite.save();
    return { isFavorite: true };
  }
};

export default {
  add,
  remove,
  getByUser,
  isFavorite,
  toggle,
};




