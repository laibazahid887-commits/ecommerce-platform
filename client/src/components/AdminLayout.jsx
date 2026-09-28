import AdminSidebar from "./AdminSidebar";
import "../styles/AdminLayout.css";

function AdminLayout({ children }) {
return (
<div className="admin-layout">
<AdminSidebar />

  <main className="admin-layout-content">
    {children}
  </main>
</div>

);
}

export default AdminLayout;