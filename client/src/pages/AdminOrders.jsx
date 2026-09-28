import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/AdminOrders.css";
function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/orders");
      setOrders(response.data.data || []);
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);
  const getNextStatuses = (status) => {
    const transitions = {
      pending: ["processing", "cancelled"],
      processing: ["shipped", "cancelled"],
      shipped: ["delivered"],
      delivered: [],
      cancelled: [],
    };
    return transitions[status] || [];
  };
  const handleStatusChange = async (orderId, status) => {
    try {
      setUpdatingOrderId(orderId);
      setError("");
      const response = await api.put(`/orders/${orderId}/status`, { status });
      const updatedOrder = response.data.data;
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: updatedOrder.status }
            : order,
        ),
      );
    } catch (error) {
      console.log(error);
      setError(
        error.response?.data?.message || "Unable to update order status.",
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };
  const handleDeleteOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this cancelled order?",
    );
    if (!confirmed) {
      return;
    }
    try {
      setDeletingOrderId(orderId);
      setError("");
      await api.delete(`/orders/${orderId}`);
      setOrders((currentOrders) =>
        currentOrders.filter((order) => order.id !== orderId),
      );
    } catch (error) {
      console.log(error);
      setError(
        error.response?.data?.message || "Unable to delete cancelled order.",
      );
    } finally {
      setDeletingOrderId(null);
    }
  };
  const getStatusClass = (status) => {
    return `admin-order-status status-${status}`;
  };
  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.status === statusFilter);
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  return (
    <section className="admin-orders-page">
      {" "}
      <div className="admin-orders-header">
        {" "}
        <div>
          {" "}
          <span className="admin-orders-eyebrow"> ORDER MANAGEMENT </span>{" "}
          <h1>Orders</h1>{" "}
          <p> Manage customer orders and update their status. </p>{" "}
        </div>{" "}
      </div>{" "}
      <div className="admin-orders-toolbar">
        {" "}
        <div className="admin-order-filters">
          {" "}
          <button
            type="button"
            className={statusFilter === "all" ? "active" : ""}
            onClick={() => setStatusFilter("all")}
          >
            {" "}
            All{" "}
          </button>{" "}
          <button
            type="button"
            className={statusFilter === "pending" ? "active" : ""}
            onClick={() => setStatusFilter("pending")}
          >
            {" "}
            Pending{" "}
          </button>{" "}
          <button
            type="button"
            className={statusFilter === "processing" ? "active" : ""}
            onClick={() => setStatusFilter("processing")}
          >
            {" "}
            Processing{" "}
          </button>{" "}
          <button
            type="button"
            className={statusFilter === "shipped" ? "active" : ""}
            onClick={() => setStatusFilter("shipped")}
          >
            {" "}
            Shipped{" "}
          </button>{" "}
          <button
            type="button"
            className={statusFilter === "delivered" ? "active" : ""}
            onClick={() => setStatusFilter("delivered")}
          >
            {" "}
            Delivered{" "}
          </button>{" "}
          <button
            type="button"
            className={statusFilter === "cancelled" ? "active" : ""}
            onClick={() => setStatusFilter("cancelled")}
          >
            {" "}
            Cancelled{" "}
          </button>{" "}
        </div>{" "}
        <span className="admin-order-count">
          {" "}
          {filteredOrders.length} orders{" "}
        </span>{" "}
      </div>{" "}
      {loading && (
        <div className="admin-orders-message"> Loading orders... </div>
      )}{" "}
      {error && !loading && <div className="admin-orders-error"> {error} </div>}{" "}
      {!loading && !error && (
        <div className="admin-orders-panel">
          {" "}
          {filteredOrders.length === 0 ? (
            <div className="admin-orders-empty"> No orders found. </div>
          ) : (
            <div className="admin-orders-table-wrapper">
              {" "}
              <table className="admin-orders-table">
                {" "}
                <thead>
                  {" "}
                  <tr>
                    {" "}
                    <th>Order</th> <th>Customer</th> <th>Total</th>{" "}
                    <th>Status</th> <th>Date</th> <th>Update Status</th>{" "}
                  </tr>{" "}
                </thead>{" "}
                <tbody>
                  {" "}
                  {filteredOrders.map((order) => {
                    const nextStatuses = getNextStatuses(order.status);
                    return (
                      <tr key={order.id}>
                        {" "}
                        <td>
                          {" "}
                          <div className="admin-order-number">
                            {" "}
                            #{order.id}{" "}
                          </div>{" "}
                        </td>{" "}
                        <td>
                          {" "}
                          <div className="admin-order-customer">
                            {" "}
                            <strong> {order.customer_name} </strong>{" "}
                            <span> {order.customer_email} </span>{" "}
                          </div>{" "}
                        </td>{" "}
                        <td>
                          {" "}
                          <strong>
                            {" "}
                            PKR{" "}
                            {Number(order.total_amount).toLocaleString()}{" "}
                          </strong>{" "}
                        </td>{" "}
                        <td>
                          {" "}
                          <span className={getStatusClass(order.status)}>
                            {" "}
                            {order.status}{" "}
                          </span>{" "}
                        </td>{" "}
                        <td>
                          {" "}
                          <span className="admin-order-date">
                            {" "}
                            {formatDate(order.created_at)}{" "}
                          </span>{" "}
                        </td>{" "}
                        <td>
                          {" "}
                          {order.status === "cancelled" ? (
                            <button
                              type="button"
                              className="admin-order-delete"
                              disabled={deletingOrderId === order.id}
                              onClick={() => handleDeleteOrder(order.id)}
                            >
                              {" "}
                              {deletingOrderId === order.id
                                ? "Deleting..."
                                : "Delete"}{" "}
                            </button>
                          ) : nextStatuses.length === 0 ? (
                            <span className="admin-order-completed">
                              {" "}
                              Completed{" "}
                            </span>
                          ) : (
                            <select
                              className="admin-order-status-select"
                              value=""
                              disabled={updatingOrderId === order.id}
                              onChange={(event) => {
                                if (event.target.value) {
                                  handleStatusChange(
                                    order.id,
                                    event.target.value,
                                  );
                                }
                              }}
                            >
                              {" "}
                              <option value="">
                                {" "}
                                {updatingOrderId === order.id
                                  ? "Updating..."
                                  : "Change status"}{" "}
                              </option>{" "}
                              {nextStatuses.map((status) => (
                                <option key={status} value={status}>
                                  {" "}
                                  {status.charAt(0).toUpperCase() +
                                    status.slice(1)}{" "}
                                </option>
                              ))}{" "}
                            </select>
                          )}{" "}
                        </td>{" "}
                      </tr>
                    );
                  })}{" "}
                </tbody>{" "}
              </table>{" "}
            </div>
          )}{" "}
        </div>
      )}{" "}
    </section>
  );
}
export default AdminOrders;
