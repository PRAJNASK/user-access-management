import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import "reflect-metadata";
import { AppDataSource } from "../ormconfig";
import authRoutes from "./routes/auth.routes";
import softwareRoutes from "./routes/software.routes";
import requestRoutes from "./routes/request.routes"; // Import request routes

dotenv.config();

console.log('DB_USER from env:', process.env.DB_USER);
console.log('DB_PASSWORD from env:', process.env.DB_PASSWORD ? 'Loaded' : 'NOT LOADED'); // Avoid logging actual password
console.log('DB_NAME from env:', process.env.DB_NAME);
console.log('JWT_SECRET from env:', process.env.JWT_SECRET ? 'Loaded' : 'NOT LOADED');

const app = express();
app.use(cors());
app.use(express.json()); // <-- REQUIRED for parsing JSON

const PORT = process.env.PORT || 5000;

AppDataSource.initialize()
  .then(() => {
    console.log("📦 Connected to PostgreSQL DB");

    // Add a handler for the root path
    app.get("/", (_req, res) => {
      res.send("🚀 User Access Management API is running!");
    });

    app.use("/api/auth", authRoutes);
    app.use("/api/software", softwareRoutes); // Moved here
    app.use("/api/requests", requestRoutes); // Use request routes

    app.listen(PORT, () => {
      console.log(`✅ Server started on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err);
  });
