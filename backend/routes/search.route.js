import express from "express";
import * as SearchController from "../controllers/search.controller.js";

const router = express.Router();

// /api/search
router.get("/products", SearchController.searchProducts);
router.get("/suggestions", SearchController.getSearchSuggestions);
router.get("/popular-categories", SearchController.getPopularCategories);
router.get("/nearby-businesses", SearchController.getNearbyBusinesses);

export default router;



