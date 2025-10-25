import FavoriteService from "../services/favorite.service.js";
import BaseError from "../errors/base.error.js";

export const addToFavorites = async (req, res, next) => {
  try {
    if (req.userType !== "user") {
      throw BaseError.ForbiddenError("Only users can add favorites");
    }

    const { productId } = req.body;
    if (!productId) throw BaseError.BadRequestError("Product ID is required");

    const favorite = await FavoriteService.add(req.userId, productId);
    return res.status(201).json({ success: true, favorite });
  } catch (error) {
    return next(error);
  }
};

export const removeFromFavorites = async (req, res, next) => {
  try {
    if (req.userType !== "user") {
      throw BaseError.ForbiddenError("Only users can remove favorites");
    }

    const { productId } = req.params;
    await FavoriteService.remove(req.userId, productId);
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};

export const getFavorites = async (req, res, next) => {
  try {
    if (req.userType !== "user") {
      throw BaseError.ForbiddenError("Only users can view favorites");
    }

    const favorites = await FavoriteService.getByUser(req.userId, req.query);
    return res.json({ success: true, favorites });
  } catch (error) {
    return next(error);
  }
};

export const toggleFavorite = async (req, res, next) => {
  try {
    if (req.userType !== "user") {
      throw BaseError.ForbiddenError("Only users can toggle favorites");
    }

    const { productId } = req.body;
    if (!productId) throw BaseError.BadRequestError("Product ID is required");

    const result = await FavoriteService.toggle(req.userId, productId);
    return res.json({ success: true, ...result });
  } catch (error) {
    return next(error);
  }
};

export const checkFavorite = async (req, res, next) => {
  try {
    if (req.userType !== "user") {
      throw BaseError.ForbiddenError("Only users can check favorites");
    }

    const { productId } = req.params;
    const isFavorite = await FavoriteService.isFavorite(req.userId, productId);
    return res.json({ success: true, isFavorite });
  } catch (error) {
    return next(error);
  }
};




