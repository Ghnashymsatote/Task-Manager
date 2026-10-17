
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || "task_manager",
  user: process.env.DB_USER || "task_user",
  password: process.env.DB_PASSWORD || "local_dev_password",
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL connection error:", error);
});
