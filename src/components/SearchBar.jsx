function SearchBar({
  searchTerm,
  onSearchChange,
  searchInputRef,
}) {
  return (
    <div className="search-bar">
      <label htmlFor="task-search">
        Search tasks
      </label>

      <div className="search-input-container">
        <input
          ref={searchInputRef}
          id="task-search"
          type="search"
          value={searchTerm}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search by title or description..."
        />

        {searchTerm && (
          <button
            type="button"
            className="clear-search-button"
            onClick={() => onSearchChange("")}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;