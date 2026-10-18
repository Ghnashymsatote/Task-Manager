
import express from "express";
import cors from "cors";
import { pool } from "./config/db";
import taskRoutes from "./routes/task.routes";

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
];

app.use(
    cors({
        origin: allowedOrigins,
    }),
);
app.use(express.json());

app.get("/api/health", async (_req, res) => {
    try {
        await pool.query("SELECT 1");

        res.status(200).json({
            success: true,
            message: "Task Manager API is running",
            database: "connected",
        });
    } catch (error) {
        console.error("Health check failed:", error);

        res.status(503).json({
            success: false,
            message: "API is running, but database connection failed",
        });
    }
});

app.use("/api/tasks", taskRoutes);

export default app;
