import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { corsOptions } from "./config/cors.js";
import { connectDB } from "./db/connectDB.js";

// Routes
import errorHandler from "./middlewares/error.middleware.js";
import { registerApiRoutes } from "./api/index.js";

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors(corsOptions));

app.use(express.json()); // allows us to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies

app.use(async (req, res, next) => {
        try {
                await connectDB();
                next();
        } catch (error) {
                next(error);
        }
});

registerApiRoutes(app);
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
