import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <aside className="admin-sidebar">
      {" "}
      <div className="admin-sidebar-brand">
        {" "}
        <span className="admin-sidebar-brand-name">WATCHSTORE</span>{" "}
        <span className="admin-sidebar-brand-label">ADMIN PANEL</span>{" "}
      </div>{" "}
      <div className="admin-sidebar-user">
        {" "}
        <div className="admin-sidebar-avatar">
          {" "}
          {user?.name?.charAt(0).toUpperCase() || "A"}{" "}
        </div>{" "}
        <div>
          {" "}
          <strong>{user?.name || "Admin"}</strong>{" "}
          <span>Administrator</span>{" "}
        </div>{" "}
      </div>{" "}
      <nav className="admin-sidebar-nav">
        {" "}
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `admin-sidebar-link ${isActive ? "active" : ""}`
          }
        >
          {" "}
          <span className="admin-sidebar-icon">⌂</span> Dashboard{" "}
        </NavLink>{" "}
        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `admin-sidebar-link ${isActive ? "active" : ""}`
          }
        >
          {" "}
          <span className="admin-sidebar-icon">◈</span> Products{" "}
        </NavLink>{" "}
        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            `admin-sidebar-link ${isActive ? "active" : ""}`
          }
        >
          {" "}
          <span className="admin-sidebar-icon">◇</span> Categories{" "}
        </NavLink>{" "}
        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `admin-sidebar-link ${isActive ? "active" : ""}`
          }
        >
          {" "}
          <span className="admin-sidebar-icon">▣</span> Orders{" "}
        </NavLink>{" "}
        <NavLink
          to="/admin/customers"
          className={({ isActive }) =>
            `admin-sidebar-link ${isActive ? "active" : ""}`
          }
        >
          {" "}
          <span className="admin-sidebar-icon">♙</span> Customers{" "}
        </NavLink>{" "}
        <NavLink
          to="/admin/messages"
          className={({ isActive }) =>
            `admin-sidebar-link ${isActive ? "active" : ""}`
          }
        >
          {" "}
          <span className="admin-sidebar-icon">✉</span> Messages{" "}
        </NavLink>{" "}
      </nav>{" "}
      <div className="admin-sidebar-bottom">
        {" "}
        <NavLink to="/" className="admin-sidebar-link">
          {" "}
          <span className="admin-sidebar-icon">←</span> Back to Store{" "}
        </NavLink>{" "}
        <button
          type="button"
          className="admin-sidebar-logout"
          onClick={handleLogout}
        >
          {" "}
          <span className="admin-sidebar-icon">↪</span> Logout{" "}
        </button>{" "}
      </div>{" "}
    </aside>
  );
}
export default AdminSidebar;
