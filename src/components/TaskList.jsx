import TaskItem from "./TaskItem";

function TaskList({
  tasks,
  onToggleTask,
  onDeleteTask,
  onEditTask,
}) {
  if (tasks.length === 0) {
    return (
      <section className="empty-state">
        <h2>No tasks yet</h2>
        <p>Add your first task using the form above.</p>
      </section>
    );
  }

  return (
    <section className="task-list">
      <h2>Your Tasks</h2>

      <div className="task-list-container">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
          />
        ))}
      </div>
    </section>
  );
}

export default TaskList;