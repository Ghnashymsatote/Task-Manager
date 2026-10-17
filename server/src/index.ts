
import dotenv from "dotenv";
import app from "./app";
import { pool } from "./config/db";

dotenv.config();

const PORT = Number(process.env.PORT || 5000);

async function startServer() {
    try {
        await pool.query("SELECT 1");

        app.listen(PORT, () => {
            console.log(`Task Manager API running at http://localhost:${PORT}`);
            console.log("PostgreSQL connected successfully");
        });
    } catch (error) {
        console.error("Failed to connect to PostgreSQL:", error);
        process.exit(1);
    }
}

startServer();
