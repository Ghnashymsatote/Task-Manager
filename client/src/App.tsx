
import { useEffect, useState } from "react";
import { createTask, getTasks, type Task } from "./services/api";



function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((task) => task.status === filter);


  async function addTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) return;

    try {
      setError("");

      const newTask = await createTask({
        title: title.trim(),
        description: description.trim(),
      });

      setTasks((current) => [newTask, ...current]);
      setTitle("");
      setDescription("");
      setShowForm(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create task",
      );
    }
  }

  useEffect(() => {
    async function loadTasks() {
      try {
        setError("");
        const data = await getTasks();
        setTasks(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load tasks",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadTasks();
  }, []);
  function toggleTask(taskId: string) {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
            ...task,
            status: task.status === "completed" ? "todo" : "completed",
          }
          : task,
      ),
    );
  }

  const completedCount = tasks.filter(
    (task) => task.status === "completed",
  ).length;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm font-semibold text-violet-600">
              TASKFLOW
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">
              My workspace
            </h1>
          </div>

          <button
            onClick={() => setShowForm((visible) => !visible)}
            className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
          >
            + New task
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <section className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total tasks" value={tasks.length} />
          <StatCard
            label="In progress"
            value={tasks.filter((task) => task.status === "in_progress").length}
          />
          <StatCard label="Completed" value={completedCount} />
        </section>

        {showForm && (
          <form
            onSubmit={addTask}
            className="mt-8 space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold">Create a task</h2>

            <input
              required
              maxLength={150}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Task title"
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-violet-500"
            />

            <textarea
              maxLength={5000}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Description (optional)"
              rows={3}
              className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-violet-500"
            />

            <div className="flex gap-3">
              <button className="rounded-xl bg-violet-600 px-4 py-2.5 font-semibold text-white hover:bg-violet-700">
                Save task
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-zinc-300 px-4 py-2.5 font-semibold hover:bg-zinc-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <section className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Your tasks</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Organize your work and track your progress.
              </p>
            </div>

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm"
            >
              <option value="all">All tasks</option>
              <option value="todo">To do</option>
              <option value="in_progress">In progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="mt-5 space-y-3">
            {loading ? (
              <p className="py-8 text-center text-sm text-zinc-500">
                Loading tasks...
              </p>
            ) : error ? (
              <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
                {error}
              </p>
            ) : (
              <>
                {filteredTasks.map((task) => (
                  <article
                    key={task.id}
                    className="flex items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
                  >
                    <input
                      type="checkbox"
                      checked={task.status === "completed"}
                      onChange={() => toggleTask(task.id)}
                      aria-label={`Complete ${task.title}`}
                      className="mt-1 size-4 accent-violet-600"
                    />

                    <div className="min-w-0 flex-1">
                      <h3
                        className={`font-semibold ${task.status === "completed"
                          ? "text-zinc-400 line-through"
                          : "text-zinc-900"
                          }`}
                      >
                        {task.title}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-500">
                        {task.description || "No description"}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <StatusBadge status={task.status} />
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                          {task.priority} priority
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
                {filteredTasks.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center">
                    <p className="font-semibold">No tasks found</p>
                    <p className="mt-1 text-sm text-zinc-500">
                      Create a task or choose another filter.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-zinc-500">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: Task["status"] }) {
  const styles = {
    todo: "bg-zinc-100 text-zinc-700",
    in_progress: "bg-blue-50 text-blue-700",
    completed: "bg-emerald-50 text-emerald-700",
  };

  const labels = {
    todo: "To do",
    in_progress: "In progress",
    completed: "Completed",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

export default App;
