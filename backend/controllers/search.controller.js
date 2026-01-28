import SearchService from "../services/search.service.js";
import BaseError from "../errors/base.error.js";

export const searchProducts = async (req, res, next) => {
  try {
    const products = await SearchService.searchProducts(req.query);
    return res.json({ success: true, products });
  } catch (error) {
    return next(error);
  }
};

export const getSearchSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json({ success: true, suggestions: [] });
    }

    const suggestions = await SearchService.getSearchSuggestions(q);
    return res.json({ success: true, suggestions });
  } catch (error) {
    return next(error);
  }
};

export const getPopularCategories = async (req, res, next) => {
  try {
    const categories = await SearchService.getPopularCategories();
    return res.json({ success: true, categories });
  } catch (error) {
    return next(error);
  }
};

export const getNearbyBusinesses = async (req, res, next) => {
  try {
    const { lat, lng, radius } = req.query;
    if (!lat || !lng) {
      throw BaseError.BadRequestError("Latitude and longitude are required");
    }

    const businesses = await SearchService.getNearbyBusinesses(
      parseFloat(lat),
      parseFloat(lng),
      parseInt(radius) || 10
    );
    return res.json({ success: true, businesses });
  } catch (error) {
    return next(error);
  }
};




