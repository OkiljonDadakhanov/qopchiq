import express from "express";
import * as FavoriteController from "../controllers/favorite.controller.js";
import { authGuard } from "../middlewares/auth.middleware.js";

const router = express.Router();

// /api/favorites
router.post("/", authGuard, FavoriteController.addToFavorites);
router.get("/", authGuard, FavoriteController.getFavorites);
router.post("/toggle", authGuard, FavoriteController.toggleFavorite);
router.get("/check/:productId", authGuard, FavoriteController.checkFavorite);
router.delete("/:productId", authGuard, FavoriteController.removeFromFavorites);

export default router;



