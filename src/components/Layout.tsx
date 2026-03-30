import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/", label: "Overview" },
  { to: "/manager", label: "Manager" },
  { to: "/resident", label: "Resident" },
  { to: "/guest", label: "Guest Portal" },
  { to: "/enforcement", label: "Enforcement" }
];

export function Layout() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="brand">Zonr</div>
          <p className="brand-copy">Smart parking operations for residential communities.</p>
        </div>
        <nav className="nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              end={item.to === "/"}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
