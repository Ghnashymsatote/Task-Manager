
import { Router } from "express";
import {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
} from "../services/task.service";

import {
    createTaskSchema,
    updateTaskSchema,
} from "../validators/task.schema";

const router = Router();

router.get("/", async (_req, res) => {
    try {
        const tasks = await getAllTasks();
        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        console.error("Failed to fetch tasks:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch tasks",
        });
    }
});

router.post("/", async (req, res) => {
    const validation = createTaskSchema.safeParse(req.body);

    if (!validation.success) {
        res.status(400).json({
            success: false,
            message: "Invalid task data",
            errors: validation.error.issues,
        });
        return;
    }

    try {
        const task = await createTask(validation.data);

        res.status(201).json({
            success: true,
            data: task,
        });
    } catch (error) {
        console.error("Failed to create task:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create task",
        });
    }
});

router.patch("/:id", async (req, res) => {
    const validation = updateTaskSchema.safeParse(req.body);

    if (!validation.success) {
        res.status(400).json({
            success: false,
            message: "Invalid task data",
            errors: validation.error.issues,
        });
        return;
    }

    try {
        const task = await updateTask(req.params.id as string, validation.data);

        if (!task) {
            res.status(404).json({
                success: false,
                message: "Task not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: task,
        });
    } catch (error) {
        console.error("Failed to update task:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update task",
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const task = await deleteTask(req.params.id as string);

        if (!task) {
            res.status(404).json({
                success: false,
                message: "Task not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
            data: task,
        });
    } catch (error) {
        console.error("Failed to delete task:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete task",
        });
    }
});

export default router;
