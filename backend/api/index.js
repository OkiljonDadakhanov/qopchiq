import express from "express";

import authRoutes from "../routes/auth.route.js";
import userRoutes from "../routes/user.route.js";
import businessRoutes from "../routes/business.route.js";
import productRoutes from "../routes/product.route.js";
import categoryRoutes from "../routes/category.route.js";
import uploadRoutes from "../routes/upload.route.js";

export const API_PREFIX = "/api";

export const registerApiRoutes = (app) => {
        const router = express.Router();

        router.use("/auth", authRoutes);
        router.use("/users", userRoutes);
        router.use("/business", businessRoutes);
        router.use("/products", productRoutes);
        router.use("/categories", categoryRoutes);
        router.use("/upload", uploadRoutes);

        app.use(API_PREFIX, router);
};

export default registerApiRoutes;
