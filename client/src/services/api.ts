
const API_URL = import.meta.env.VITE_API_URL;
export type Task = {
    id: string;
    title: string;
    description: string;
    status: "todo" | "in_progress" | "completed";
    priority: "low" | "medium" | "high";
    due_date: string | null;
};



type ApiResponse<T> = {
    success: boolean;
    data: T;
    message?: string;
};

async function request<T>(
    path: string,
    options?: RequestInit,
): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });

    const result = (await response.json()) as ApiResponse<T>;

    if (!response.ok || !result.success) {
        throw new Error(result.message || "Something went wrong");
    }

    return result.data;
}

export function getTasks() {
    return request<Task[]>("/tasks");
}

export function createTask(input: {
    title: string;
    description: string;
}) {
    return request<Task>("/tasks", {
        method: "POST",
        body: JSON.stringify(input),
    });
}
