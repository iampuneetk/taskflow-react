function TaskStats({ tasks }) {
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const totalTasks = safeTasks.length;

  const completedTasks = safeTasks.filter(
    (task) => task.completed
  ).length;

  const activeTasks = totalTasks - completedTasks;

  const overdueTasks = safeTasks.filter((task) => {
    if (!task.dueDate || task.completed) {
      return false;
    }

    const dueDate = new Date(
      `${task.dueDate}T23:59:59`
    );

    return dueDate < new Date();
  }).length;

  const completionPercentage =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) * 100
        );

  return (
    <section
      className="task-stats"
      aria-label="Task statistics"
    >
      <article className="stat-card">
        <span>Total</span>
        <strong>{totalTasks}</strong>
      </article>

      <article className="stat-card">
        <span>Active</span>
        <strong>{activeTasks}</strong>
      </article>

      <article className="stat-card">
        <span>Completed</span>
        <strong>{completedTasks}</strong>
      </article>

      <article className="stat-card overdue-stat">
        <span>Overdue</span>
        <strong>{overdueTasks}</strong>
      </article>

      <article className="stat-card progress-stat">
        <div className="progress-heading">
          <span>Progress</span>
          <strong>{completionPercentage}%</strong>
        </div>

        <div
          className="progress-bar"
          role="progressbar"
          aria-valuenow={completionPercentage}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div
            className="progress-fill"
            style={{
              width: `${completionPercentage}%`,
            }}
          />
        </div>
      </article>
    </section>
  );
}

export default TaskStats;