import express from "express";

import authRoutes from "../routes/auth.route.js";
import userRoutes from "../routes/user.route.js";
import businessRoutes from "../routes/business.route.js";
import productRoutes from "../routes/product.route.js";
import categoryRoutes from "../routes/category.route.js";
import orderRoutes from "../routes/order.route.js";
import favoriteRoutes from "../routes/favorite.route.js";
import notificationRoutes from "../routes/notification.route.js";
import searchRoutes from "../routes/search.route.js";
import analyticsRoutes from "../routes/analytics.route.js";
import uploadRoutes from "../routes/upload.route.js";

export const API_PREFIX = "/api";

export const registerApiRoutes = (app) => {
        const router = express.Router();

        router.use("/auth", authRoutes);
        router.use("/users", userRoutes);
        router.use("/business", businessRoutes);
        router.use("/products", productRoutes);
        router.use("/categories", categoryRoutes);
        router.use("/orders", orderRoutes);
        router.use("/favorites", favoriteRoutes);
        router.use("/notifications", notificationRoutes);
        router.use("/search", searchRoutes);
        router.use("/analytics", analyticsRoutes);
        router.use("/upload", uploadRoutes);

        app.use(API_PREFIX, router);
};

export default registerApiRoutes;
