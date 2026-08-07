import { useState } from "react";

function createEmptyForm() {
  return {
    title: "",
    description: "",
    category: "Personal",
    priority: "Medium",
    dueDate: "",
  };
}

function createInitialForm(editingTask) {
  if (!editingTask) {
    return createEmptyForm();
  }

  return {
    title: editingTask.title ?? "",
    description: editingTask.description ?? "",
    category:
      editingTask.category ?? "Personal",
    priority:
      editingTask.priority ?? "Medium",
    dueDate: editingTask.dueDate ?? "",
  };
}

function TaskForm({
  onAddTask,
  editingTask,
  onUpdateTask,
  onCancelEdit,
  titleInputRef,
}) {
  const [formData, setFormData] = useState(() =>
    createInitialForm(editingTask)
  );

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const cleanedTitle =
      formData.title.trim();

    if (!cleanedTitle) {
      titleInputRef?.current?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      let wasSuccessful;

      if (editingTask) {
        wasSuccessful = await onUpdateTask({
          ...editingTask,
          ...formData,
          title: cleanedTitle,
          description:
            formData.description.trim(),
        });
      } else {
        wasSuccessful = await onAddTask({
          ...formData,
          title: cleanedTitle,
          description:
            formData.description.trim(),
          completed: false,
        });
      }

      if (!wasSuccessful) {
        return;
      }

      setFormData(createEmptyForm());
      titleInputRef?.current?.focus();
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    setFormData(createEmptyForm());
    onCancelEdit();
  }

  function handleFormKeyDown(event) {
    const shouldSubmit =
      (event.ctrlKey || event.metaKey) &&
      event.key === "Enter";

    if (shouldSubmit) {
      event.preventDefault();
      event.currentTarget.requestSubmit();
    }
  }

  return (
    <form
      className="task-form"
      onSubmit={handleSubmit}
      onKeyDown={handleFormKeyDown}
    >
      <div className="form-group form-group-full">
        <label htmlFor="title">
          Task title
        </label>

        <input
          ref={titleInputRef}
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter a task"
          maxLength={100}
          autoFocus={Boolean(editingTask)}
        />
      </div>

      <div className="form-group form-group-full">
        <label htmlFor="description">
          Description
        </label>

        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Add some details"
          rows={3}
          maxLength={300}
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">
          Category
        </label>

        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="Personal">
            Personal
          </option>

          <option value="Work">
            Work
          </option>

          <option value="Learning">
            Learning
          </option>

          <option value="Health">
            Health
          </option>

          <option value="Other">
            Other
          </option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="priority">
          Priority
        </label>

        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="Low">Low</option>
          <option value="Medium">
            Medium
          </option>
          <option value="High">
            High
          </option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="dueDate">
          Due date
        </label>

        <input
          id="dueDate"
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
        />
      </div>

      <div className="form-actions">
        <button
          type="submit"
          disabled={
            !formData.title.trim() ||
            isSubmitting
          }
        >
          {isSubmitting
            ? "Saving..."
            : editingTask
              ? "Update Task"
              : "Add Task"}
        </button>

        {editingTask && (
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;