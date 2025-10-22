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

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth/business", businessRoutes);
app.use("/api/upload", uploadRoutes);

app.use(errorHandler);

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
