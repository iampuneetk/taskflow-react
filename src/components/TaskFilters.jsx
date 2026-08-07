function TaskFilters({
  statusFilter,
  categoryFilter,
  priorityFilter,
  sortBy,
  onStatusChange,
  onCategoryChange,
  onPriorityChange,
  onSortChange,
  onClearFilters,
  hasActiveFilters,
}) {
  return (
    <section className="task-filters">
      <div className="filter-group">
        <label htmlFor="status-filter">Status</label>

        <select
          id="status-filter"
          value={statusFilter}
          onChange={(event) =>
            onStatusChange(event.target.value)
          }
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="category-filter">Category</label>

        <select
          id="category-filter"
          value={categoryFilter}
          onChange={(event) =>
            onCategoryChange(event.target.value)
          }
        >
          <option value="all">All categories</option>
          <option value="Personal">Personal</option>
          <option value="Work">Work</option>
          <option value="Learning">Learning</option>
          <option value="Health">Health</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="priority-filter">Priority</label>

        <select
          id="priority-filter"
          value={priorityFilter}
          onChange={(event) =>
            onPriorityChange(event.target.value)
          }
        >
          <option value="all">All priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="sort-by">Sort by</label>

        <select
          id="sort-by"
          value={sortBy}
          onChange={(event) =>
            onSortChange(event.target.value)
          }
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="dueDate">Due date</option>
          <option value="priority">Priority</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>

      <button
        type="button"
        className="clear-filters-button"
        onClick={onClearFilters}
        disabled={!hasActiveFilters}
      >
        Clear Filters
      </button>
    </section>
  );
}

export default TaskFilters;