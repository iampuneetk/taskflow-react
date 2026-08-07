import useTheme from "../hooks/useTheme.js";

function Header({ taskCount }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div>
        <h1>TaskFlow</h1>
        <p>Organize your tasks efficiently.</p>
      </div>

      <div className="header-actions">
        <span className="task-count">
          {taskCount} {taskCount === 1 ? "task" : "tasks"}
        </span>

        <button
          type="button"
          className="theme-button"
          onClick={toggleTheme}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </header>
  );
}

export default Header;