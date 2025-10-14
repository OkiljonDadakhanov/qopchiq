import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsOptions } from "./config/cors.js";
import { connectDB } from "./db/connectDB.js";

// Routes
import authRoutes from "./routes/auth.route.js";
import errorHandler from "./middlewares/error.middleware.js";
import userRoutes from "./routes/user.route.js";
import businessRoutes from "./routes/business.route.js";
import uploadRoutes from "./routes/upload.route.js";

const app = express();
const PORT = process.env.PORT || 5000;
app.set("trust proxy", 1);
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api/health", (req, res) => {
        res.json({
                status: "ok",
                uptime: process.uptime(),
        });
});
// Global error handler (eng oxirida)
app.use(errorHandler);

// if (process.env.NODE_ENV === "production") {
// 	app.use(express.static(path.join(__dirname, "/frontend/dist")));

// 	app.get("*", (req, res) => {
// 		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// 	});
// }

const startServer = async () => {
        try {
                await connectDB();
                app.listen(PORT, "0.0.0.0", () => {
                        console.log("Server is running on port: ", PORT);
                });
        } catch (error) {
                console.error("Failed to start the server:", error.message);
        }
};

startServer();
