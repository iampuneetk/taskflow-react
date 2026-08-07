function TaskItem({
  task,
  onToggleTask,
  onDeleteTask,
  onEditTask,
}) {
  function formatDueDate(date) {
    if (!date) {
      return "No due date";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString();
  }

  const isOverdue = Boolean(
    task.dueDate &&
      !task.completed &&
      new Date(`${task.dueDate}T23:59:59`) <
        new Date()
  );

  const taskClasses = [
    "task-item",
    task.completed ? "completed-task" : "",
    isOverdue ? "overdue-task" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={taskClasses}>
      <div className="task-content">
        <input
          type="checkbox"
          checked={Boolean(task.completed)}
          onChange={() => onToggleTask(task.id)}
          aria-label={`Mark ${task.title} as completed`}
        />

        <div className="task-details">
          <h3>{task.title}</h3>

          {task.description && (
            <p className="task-description">
              {task.description}
            </p>
          )}

          <div className="task-meta">
            <span className="category-badge">
              {task.category || "Personal"}
            </span>

            <span
              className={`priority-badge priority-${(
                task.priority || "Medium"
              ).toLowerCase()}`}
            >
              {task.priority || "Medium"}
            </span>

            <span
              className={`due-date ${
                isOverdue ? "overdue-badge" : ""
              }`}
            >
              {isOverdue ? "Overdue: " : "Due: "}
              {formatDueDate(task.dueDate)}
            </span>

            <span className="task-status">
              {task.completed
                ? "Completed"
                : isOverdue
                  ? "Overdue"
                  : "Active"}
            </span>
          </div>
        </div>
      </div>

      <div className="task-actions">
        <button
          type="button"
          className="edit-button"
          onClick={() => onEditTask(task)}
        >
          Edit
        </button>

        <button
          type="button"
          className="delete-button"
          onClick={() => onDeleteTask(task.id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default TaskItem;