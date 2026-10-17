
import { pool } from "../config/db";
import type { createTaskSchema } from "../validators/task.schema";
import type { z } from "zod";
import type { updateTaskSchema } from "../validators/task.schema";
type CreateTaskInput = z.infer<typeof createTaskSchema>;
type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export async function getAllTasks() {
    const result = await pool.query(
        "SELECT * FROM tasks ORDER BY created_at DESC"
    );

    return result.rows;
}

export async function createTask(input: CreateTaskInput) {
    const { title, description, status, priority, due_date } = input;

    const result = await pool.query(
        `INSERT INTO tasks (title, description, status, priority, due_date)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
        [title, description, status, priority, due_date ?? null]
    );

    return result.rows[0];
}




export async function updateTask(id: string, input: UpdateTaskInput) {
    const fields: string[] = [];
    const values: unknown[] = [];

    for (const [key, value] of Object.entries(input)) {
        values.push(value);
        fields.push(`${key} = $${values.length}`);
    }

    fields.push("updated_at = NOW()");
    values.push(id);

    const result = await pool.query(
        `UPDATE tasks SET ${fields.join(", ")} WHERE id = $${values.length} RETURNING *`,
        values
    );

    return result.rows[0] ?? null;
}

export async function deleteTask(id: string) {
    const result = await pool.query(
        "DELETE FROM tasks WHERE id = $1 RETURNING id",
        [id]
    );

    return result.rows[0] ?? null;
}
