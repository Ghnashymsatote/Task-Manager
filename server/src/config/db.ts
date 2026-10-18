
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

function getDatabaseConfig() {
    const requiredVariables = [
        "DB_HOST",
        "DB_NAME",
        "DB_USER",
        "DB_PASSWORD",
    ] as const;

    if (isProduction) {
        const missing = requiredVariables.filter(
            (key) => !process.env[key],
        );

        if (missing.length > 0) {
            throw new Error(
                `Missing required database environment variables: ${missing.join(", ")}`,
            );
        }
    }

    return {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT || 5432),
        database: process.env.DB_NAME || "task_manager",
        user: process.env.DB_USER || "task_user",
        password: process.env.DB_PASSWORD || "local_dev_password",
    };
}

export const pool = new Pool(getDatabaseConfig());

pool.on("error", (error) => {
    console.error("Unexpected PostgreSQL connection error:", error);
});
