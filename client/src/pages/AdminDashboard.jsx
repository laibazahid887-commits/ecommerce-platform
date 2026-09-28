import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
const [products, setProducts] = useState([]);
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
const fetchDashboardData = async () => {
try {
const [productsResponse, ordersResponse] = await Promise.all([
api.get("/products?limit=100"),
api.get("/orders"),
]);

    setProducts(
      productsResponse.data.data?.products || []
    );

    setOrders(
      ordersResponse.data.data || []
    );
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

fetchDashboardData();

}, []);

const pendingOrders = orders.filter(
(order) => order.status === "pending"
);

const totalSales = orders
.filter((order) => order.status !== "cancelled")
.reduce(
(total, order) => total + Number(order.total_amount || 0),
0
);

if (loading) {
return (
<section className="admin-dashboard-page">
<div className="admin-loading">
Loading dashboard...
</div>
</section>
);
}

return (
<section className="admin-dashboard-page">
<div className="admin-dashboard-header">
<div>
<p className="admin-eyebrow">WATCHSTORE ADMIN</p>
<h1>Dashboard</h1>
<p>
Manage your store, products, orders and customers.
</p>
</div>
</div>

  <div className="admin-stats-grid">
    <div className="admin-stat-card">
      <span className="admin-stat-label">
        Total Products
      </span>
      <strong>{products.length}</strong>
      <span className="admin-stat-link">
        Products in store
      </span>
    </div>

    <div className="admin-stat-card">
      <span className="admin-stat-label">
        Total Orders
      </span>
      <strong>{orders.length}</strong>
      <span className="admin-stat-link">
        Orders received
      </span>
    </div>

    <div className="admin-stat-card">
      <span className="admin-stat-label">
        Pending Orders
      </span>
      <strong>{pendingOrders.length}</strong>
      <span className="admin-stat-link">
        Need attention
      </span>
    </div>

    <div className="admin-stat-card">
      <span className="admin-stat-label">
        Total Sales
      </span>
      <strong>
        PKR {totalSales.toLocaleString()}
      </strong>
      <span className="admin-stat-link">
        Non-cancelled orders
      </span>
    </div>
  </div>

  <div className="admin-dashboard-content">
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <span className="admin-panel-eyebrow">
            ORDER MANAGEMENT
          </span>
          <h2>Recent Orders</h2>
        </div>

        <Link
          to="/admin/orders"
          className="admin-panel-link"
        >
          View All
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="admin-empty-state">
          No orders found.
        </div>
      ) : (
        <div className="admin-orders-table-wrapper">
          <table className="admin-orders-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>

                  <td>
                    <div className="admin-customer-cell">
                      <strong>
                        {order.customer_name}
                      </strong>
                      <span>
                        {order.customer_email}
                      </span>
                    </div>
                  </td>

                  <td>
                    PKR{" "}
                    {Number(
                      order.total_amount
                    ).toLocaleString()}
                  </td>

                  <td>
                    <span
                      className={`admin-status admin-status-${order.status}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

    <div className="admin-panel admin-quick-panel">
      <div className="admin-panel-header">
        <div>
          <span className="admin-panel-eyebrow">
            STORE MANAGEMENT
          </span>
          <h2>Quick Actions</h2>
        </div>
      </div>

      <div className="admin-quick-actions">
        <Link
          to="/admin/products"
          className="admin-action-card"
        >
          <strong>Manage Products</strong>
          <span>
            Add, edit or remove watches
          </span>
        </Link>

        <Link
          to="/admin/categories"
          className="admin-action-card"
        >
          <strong>Manage Categories</strong>
          <span>
            Organize your product collections
          </span>
        </Link>

        <Link
          to="/admin/orders"
          className="admin-action-card"
        >
          <strong>Manage Orders</strong>
          <span>
            Review and update customer orders
          </span>
        </Link>
      </div>
    </div>
  </div>
</section>

);
}

export default AdminDashboard;