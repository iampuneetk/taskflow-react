import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";

/*
 * Database uses snake_case:
 * due_date, created_at
 *
 * React app uses camelCase:
 * dueDate, createdAt
 */

function mapDatabaseTask(task) {
  return {
    id: task.id,
    title: task.title,
    description: task.description ?? "",
    category: task.category ?? "Personal",
    priority: task.priority ?? "Medium",
    dueDate: task.due_date ?? "",
    completed: Boolean(task.completed),
    createdAt: task.created_at,
    updatedAt: task.updated_at,
  };
}

function mapReactTask(task) {
  return {
    title: task.title,
    description: task.description ?? "",
    category: task.category ?? "Personal",
    priority: task.priority ?? "Medium",
    due_date: task.dueDate || null,
    completed: Boolean(task.completed),
  };
}

function useTasks(userId) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * READ: Load tasks from Supabase
   */

  useEffect(() => {
    let isCancelled = false;

    async function loadTasks() {
      const { data, error: queryError } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", {
          ascending: false,
        });

      if (isCancelled) {
        return;
      }

      if (queryError) {
        setError(queryError.message);
        setIsLoading(false);
        return;
      }

      const formattedTasks = (data ?? []).map(
        mapDatabaseTask
      );

      setTasks(formattedTasks);
      setIsLoading(false);
    }

    loadTasks();

    return () => {
      isCancelled = true;
    };
  }, [userId]);

  /*
   * CREATE: Add a task
   */

  async function addTask(newTask) {
    setError("");

    const databaseTask = {
      ...mapReactTask(newTask),
      user_id: userId,
    };

    const { data, error: queryError } = await supabase
      .from("tasks")
      .insert(databaseTask)
      .select()
      .single();

    if (queryError) {
      setError(queryError.message);
      return false;
    }

    const createdTask = mapDatabaseTask(data);

    setTasks((currentTasks) => [
      createdTask,
      ...currentTasks,
    ]);

    return true;
  }

  /*
   * UPDATE: Edit a task
   */

  async function updateTask(updatedTask) {
    setError("");

    const { data, error: queryError } = await supabase
      .from("tasks")
      .update(mapReactTask(updatedTask))
      .eq("id", updatedTask.id)
      .eq("user_id", userId)
      .select()
      .single();

    if (queryError) {
      setError(queryError.message);
      return false;
    }

    const savedTask = mapDatabaseTask(data);

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === savedTask.id ? savedTask : task
      )
    );

    return true;
  }

  /*
   * UPDATE: Toggle completed status
   */

  async function toggleTask(taskId) {
    setError("");

    const currentTask = tasks.find(
      (task) => task.id === taskId
    );

    if (!currentTask) {
      setError("Task could not be found.");
      return false;
    }

    const { data, error: queryError } = await supabase
      .from("tasks")
      .update({
        completed: !currentTask.completed,
      })
      .eq("id", taskId)
      .eq("user_id", userId)
      .select()
      .single();

    if (queryError) {
      setError(queryError.message);
      return false;
    }

    const savedTask = mapDatabaseTask(data);

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === savedTask.id ? savedTask : task
      )
    );

    return true;
  }

  /*
   * DELETE: Delete a task
   */

  async function deleteTask(taskId) {
    setError("");

    const { error: queryError } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId)
      .eq("user_id", userId);

    if (queryError) {
      setError(queryError.message);
      return false;
    }

    setTasks((currentTasks) =>
      currentTasks.filter(
        (task) => task.id !== taskId
      )
    );

    return true;
  }

  return {
    tasks,
    isLoading,
    error,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
  };
}

export default useTasks;