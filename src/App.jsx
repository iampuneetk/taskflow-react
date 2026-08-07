import {
  useEffect,
  useRef,
  useState,
} from "react";

import Header from "./components/Header.jsx";
import TaskStats from "./components/TaskStats.jsx";
import TaskForm from "./components/TaskForm.jsx";
import SearchBar from "./components/SearchBar.jsx";
import TaskFilters from "./components/TaskFilters.jsx";
import TaskList from "./components/TaskList.jsx";

import useTasks from "./hooks/useTasks.js";
import useTheme from "./hooks/useTheme.js";

import "./App.css";

function App({ user }) {
  const {
    tasks,
    isLoading,
    error: taskError,
    addTask: createTask,
    updateTask: saveTask,
    toggleTask: toggleCloudTask,
    deleteTask: removeCloudTask,
  } = useTasks(user.id);

  const [editingTask, setEditingTask] =
    useState(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState("all");

  const [
    priorityFilter,
    setPriorityFilter,
  ] = useState("all");

  const [sortBy, setSortBy] =
    useState("newest");

  const titleInputRef = useRef(null);
  const searchInputRef = useRef(null);

  const { toggleTheme } = useTheme();

  const safeTasks = Array.isArray(tasks)
    ? tasks
    : [];

  useEffect(() => {
    function handleKeyDown(event) {
      const target = event.target;

      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable;

      if (event.key === "Escape") {
        setEditingTask(null);
        return;
      }

      if (
        isTyping ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey
      ) {
        return;
      }

      if (event.key === "/") {
        event.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      if (
        event.key.toLowerCase() === "n"
      ) {
        event.preventDefault();
        titleInputRef.current?.focus();
        return;
      }

      if (
        event.key.toLowerCase() === "d"
      ) {
        event.preventDefault();
        toggleTheme();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [toggleTheme]);

  async function addTask(newTask) {
    return createTask(newTask);
  }

  async function toggleTask(taskId) {
    return toggleCloudTask(taskId);
  }

  async function deleteTask(taskId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return false;
    }

    const wasDeleted =
      await removeCloudTask(taskId);

    if (
      wasDeleted &&
      editingTask?.id === taskId
    ) {
      setEditingTask(null);
    }

    return wasDeleted;
  }

  async function updateTask(updatedTask) {
    const wasUpdated =
      await saveTask(updatedTask);

    if (wasUpdated) {
      setEditingTask(null);
    }

    return wasUpdated;
  }

  function cancelEdit() {
    setEditingTask(null);
  }

  function clearFilters() {
    setSearchTerm("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setPriorityFilter("all");
    setSortBy("newest");
  }

  const normalizedSearch = searchTerm
    .trim()
    .toLowerCase();

  const filteredTasks = safeTasks.filter(
    (task) => {
      const title = String(
        task.title || ""
      ).toLowerCase();

      const description = String(
        task.description || ""
      ).toLowerCase();

      const category = String(
        task.category || "Personal"
      );

      const priority = String(
        task.priority || "Medium"
      );

      const matchesSearch =
        title.includes(normalizedSearch) ||
        description.includes(
          normalizedSearch
        ) ||
        category
          .toLowerCase()
          .includes(normalizedSearch) ||
        priority
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" &&
          !task.completed) ||
        (statusFilter === "completed" &&
          task.completed);

      const matchesCategory =
        categoryFilter === "all" ||
        category === categoryFilter;

      const matchesPriority =
        priorityFilter === "all" ||
        priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory &&
        matchesPriority
      );
    }
  );

  const sortedTasks = [
    ...filteredTasks,
  ].sort((taskA, taskB) => {
    if (sortBy === "newest") {
      return (
        new Date(
          taskB.createdAt || 0
        ).getTime() -
        new Date(
          taskA.createdAt || 0
        ).getTime()
      );
    }

    if (sortBy === "oldest") {
      return (
        new Date(
          taskA.createdAt || 0
        ).getTime() -
        new Date(
          taskB.createdAt || 0
        ).getTime()
      );
    }

    if (sortBy === "alphabetical") {
      return String(
        taskA.title || ""
      ).localeCompare(
        String(taskB.title || "")
      );
    }

    if (sortBy === "priority") {
      const priorityOrder = {
        High: 1,
        Medium: 2,
        Low: 3,
      };

      return (
        priorityOrder[
          taskA.priority || "Medium"
        ] -
        priorityOrder[
          taskB.priority || "Medium"
        ]
      );
    }

    if (sortBy === "dueDate") {
      if (
        !taskA.dueDate &&
        !taskB.dueDate
      ) {
        return 0;
      }

      if (!taskA.dueDate) {
        return 1;
      }

      if (!taskB.dueDate) {
        return -1;
      }

      return (
        new Date(
          `${taskA.dueDate}T00:00:00`
        ).getTime() -
        new Date(
          `${taskB.dueDate}T00:00:00`
        ).getTime()
      );
    }

    return 0;
  });

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    statusFilter !== "all" ||
    categoryFilter !== "all" ||
    priorityFilter !== "all" ||
    sortBy !== "newest";

  if (isLoading) {
    return (
      <main className="app">
        <Header taskCount={0} />

        <section className="empty-state">
          <h2>Loading tasks...</h2>

          <p>
            Reading your tasks from the
            cloud database.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="app">
      <Header taskCount={safeTasks.length} />

      {taskError && (
        <p
          className="cloud-error"
          role="alert"
        >
          Database error: {taskError}
        </p>
      )}

      <TaskStats tasks={safeTasks} />

      <section
        className="shortcut-help"
        aria-label="Keyboard shortcuts"
      >
        <span>
          <kbd>N</kbd> New task
        </span>

        <span>
          <kbd>/</kbd> Search
        </span>

        <span>
          <kbd>D</kbd> Theme
        </span>

        <span>
          <kbd>Esc</kbd> Cancel edit
        </span>

        <span>
          <kbd>Ctrl</kbd> +{" "}
          <kbd>Enter</kbd> Submit
        </span>
      </section>

      <TaskForm
        key={
          editingTask?.id ?? "new-task"
        }
        onAddTask={addTask}
        editingTask={editingTask}
        onUpdateTask={updateTask}
        onCancelEdit={cancelEdit}
        titleInputRef={titleInputRef}
      />

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchInputRef={searchInputRef}
      />

      <TaskFilters
        statusFilter={statusFilter}
        categoryFilter={categoryFilter}
        priorityFilter={priorityFilter}
        sortBy={sortBy}
        onStatusChange={setStatusFilter}
        onCategoryChange={
          setCategoryFilter
        }
        onPriorityChange={
          setPriorityFilter
        }
        onSortChange={setSortBy}
        onClearFilters={clearFilters}
        hasActiveFilters={
          hasActiveFilters
        }
      />

      {hasActiveFilters && (
        <p className="search-results-count">
          Showing {sortedTasks.length} of{" "}
          {safeTasks.length}{" "}
          {safeTasks.length === 1
            ? "task"
            : "tasks"}
        </p>
      )}

      <TaskList
        tasks={sortedTasks}
        onToggleTask={toggleTask}
        onDeleteTask={deleteTask}
        onEditTask={setEditingTask}
        emptyTitle={
          safeTasks.length === 0
            ? "No cloud tasks yet"
            : "No matching tasks"
        }
        emptyMessage={
          safeTasks.length === 0
            ? "Add your first task. It will be saved in Supabase."
            : "Try changing or clearing your filters."
        }
      />
    </main>
  );
}

export default App;