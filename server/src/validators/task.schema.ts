
import { z } from "zod";

export const createTaskSchema = z.object({
    title: z.string().trim().min(1).max(150),
    description: z.string().max(5000).optional().default(""),
    status: z
        .enum(["todo", "in_progress", "completed"])
        .optional()
        .default("todo"),
    priority: z.enum(["low", "medium", "high"]).optional().default("medium"),
    due_date: z.iso.date().nullable().optional(),
});

export const updateTaskSchema = createTaskSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    { message: "Provide at least one field to update" }
);
