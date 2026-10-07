import { NavLink } from "react-router-dom";
const linkClass = ({ isActive }) => (isActive ? "active" : undefined);
const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

export default function AppNavigation() {
  return (
    <nav className="app-nav" aria-label="Primary">
      <NavLink to="/" className="brand" end>
        cloud<span>era</span>
      </NavLink>
      <div className="app-nav-links">
        <NavLink to="/" end className={linkClass}>Home</NavLink>
        <NavLink to="/explore/v2" className={linkClass}>Cloudera</NavLink>
        <NavLink to="/components" className={({ isActive }) => (isActive || window.location.hash.startsWith("#/component/") ? "active" : undefined)}>
          Components
        </NavLink>
        <NavLink to="/industries" className={linkClass}>Industries</NavLink>
      </div>
      <button type="button" className="app-nav-search" onClick={() => window.dispatchEvent(new Event("open-command-palette"))}>
        <span aria-hidden="true">⌕</span>
        <span className="app-nav-search-label">Search</span>
        <kbd>{isMac ? "⌘" : "Ctrl"} K</kbd>
      </button>
    </nav>
  );
}
