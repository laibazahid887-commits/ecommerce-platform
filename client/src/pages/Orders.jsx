import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useNotifications } from "../context/NotificationContext";
function Orders() {
  const { addNotification } = useNotifications();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelLoading, setCancelLoading] = useState(null);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders/my-orders");
        console.log("My orders response:", response.data);
        setOrders(response.data.data || []);
      } catch (error) {
        console.log(error);
        setError(
          error.response?.data?.message || "Unable to load your orders.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);
  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?",
    );
    if (!confirmCancel) {
      return;
    }
    try {
      setCancelLoading(orderId);
      setError("");
      const response = await api.put(`/orders/${orderId}/cancel`);
      console.log("Cancel order response:", response.data);
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? { ...order, status: "cancelled" } : order,
        ),
      );
      addNotification("Order cancelled successfully.", "success");
    } catch (error) {
      console.log(error);
      const message =
        error.response?.data?.message || "Unable to cancel the order.";
      setError(message);
      addNotification(message, "error");
    } finally {
      setCancelLoading(null);
    }
  };
  if (loading) {
    return (
      <section className="orders-page">
        {" "}
        <div className="orders-header">
          {" "}
          <p className="orders-subtitle">YOUR ACCOUNT</p>{" "}
          <h1>My Orders</h1>{" "}
        </div>{" "}
        <div className="orders-message">
          {" "}
          <p>Loading your orders...</p>{" "}
        </div>{" "}
      </section>
    );
  }
  if (error && orders.length === 0) {
    return (
      <section className="orders-page">
        {" "}
        <div className="orders-header">
          {" "}
          <p className="orders-subtitle">YOUR ACCOUNT</p>{" "}
          <h1>My Orders</h1>{" "}
        </div>{" "}
        <div className="orders-message">
          {" "}
          <h2>Unable to load orders</h2> <p>{error}</p>{" "}
          <Link to="/products" className="orders-action-btn">
            {" "}
            Continue Shopping{" "}
          </Link>{" "}
        </div>{" "}
      </section>
    );
  }
  if (orders.length === 0) {
    return (
      <section className="orders-page">
        {" "}
        <div className="orders-header">
          {" "}
          <p className="orders-subtitle">YOUR ACCOUNT</p> <h1>My Orders</h1>{" "}
          <p> View and manage your watch orders. </p>{" "}
        </div>{" "}
        <div className="orders-empty">
          {" "}
          <div className="orders-empty-icon">◷</div> <h2>No orders yet</h2>{" "}
          <p> You haven't placed any orders yet. </p>{" "}
          <Link to="/products" className="orders-action-btn">
            {" "}
            Explore Watches{" "}
          </Link>{" "}
        </div>{" "}
      </section>
    );
  }
  return (
    <section className="orders-page">
      {" "}
      <div className="orders-header">
        {" "}
        <p className="orders-subtitle">YOUR ACCOUNT</p> <h1>My Orders</h1>{" "}
        <p> View and manage your watch orders. </p>{" "}
      </div>{" "}
      {error && <p className="auth-error"> {error} </p>}{" "}
      <div className="orders-list">
        {" "}
        {orders.map((order) => (
          <div className="order-card" key={order.id}>
            {" "}
            <div className="order-card-top">
              {" "}
              <div>
                {" "}
                <p className="order-label"> ORDER NUMBER </p>{" "}
                <h2>#{order.id}</h2>{" "}
              </div>{" "}
              <span className="order-status"> {order.status} </span>{" "}
            </div>{" "}
            <div className="order-card-details">
              {" "}
              <div>
                {" "}
                <span>Order Date</span>{" "}
                <strong>
                  {" "}
                  {new Date(order.created_at).toLocaleDateString()}{" "}
                </strong>{" "}
              </div>{" "}
              <div>
                {" "}
                <span>Total Amount</span>{" "}
                <strong>
                  {" "}
                  PKR {Number(order.total_amount).toLocaleString()}{" "}
                </strong>{" "}
              </div>{" "}
            </div>{" "}
            <div className="order-card-actions">
              {" "}
              <Link to={`/orders/${order.id}`} className="order-view-btn">
                {" "}
                View Order{" "}
              </Link>{" "}
              {order.status === "pending" && (
                <button
                  className="order-cancel-btn"
                  onClick={() => handleCancelOrder(order.id)}
                  disabled={cancelLoading === order.id}
                >
                  {" "}
                  {cancelLoading === order.id
                    ? "Cancelling..."
                    : "Cancel Order"}{" "}
                </button>
              )}{" "}
            </div>{" "}
          </div>
        ))}{" "}
      </div>{" "}
    </section>
  );
}
export default Orders;
