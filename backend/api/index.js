import express from "express";

import authRoutes from "./routes/auth.routes.js";
import listingsRoutes from "./routes/listings.routes.js";
import reservationsRoutes from "./routes/reservations.routes.js";
import userRoutes from "../routes/user.route.js";
import businessRoutes from "../routes/business.route.js";
import uploadRoutes from "../routes/upload.route.js";

export const API_PREFIX = "/api";

export const registerApiRoutes = (app) => {
        const router = express.Router();

        router.use("/auth", authRoutes);
        router.use("/users", userRoutes);
        router.use("/business", businessRoutes);
        router.use("/upload", uploadRoutes);
        router.use("/listings", listingsRoutes);
        router.use("/reservations", reservationsRoutes);

        app.use(API_PREFIX, router);
};

export default registerApiRoutes;
