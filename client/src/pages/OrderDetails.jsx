import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${id}`);
        console.log("Order response:", response.data);
        setOrder(response.data.data.order);
        setItems(response.data.data.items || []);
      } catch (error) {
        console.log(error);
        setError(
          error.response?.data?.message || "Unable to load order details.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);
  if (loading) {
    return (
      <section className="order-page">
        {" "}
        <div className="order-message">
          {" "}
          <p>Loading order details...</p>{" "}
        </div>{" "}
      </section>
    );
  }
  if (error) {
    return (
      <section className="order-page">
        {" "}
        <div className="order-message">
          {" "}
          <h2>Unable to load order</h2> <p>{error}</p>{" "}
          <Link to="/products" className="order-action-btn">
            {" "}
            Continue Shopping{" "}
          </Link>{" "}
        </div>{" "}
      </section>
    );
  }
  if (!order) {
    return (
      <section className="order-page">
        {" "}
        <div className="order-message">
          {" "}
          <h2>Order not found</h2>{" "}
          <Link to="/products" className="order-action-btn">
            {" "}
            Continue Shopping{" "}
          </Link>{" "}
        </div>{" "}
      </section>
    );
  }
  return (
    <section className="order-page">
      {" "}
      <div className="order-confirmation">
        {" "}
        <div className="order-success-icon"> ✓ </div>{" "}
        <p className="order-subtitle"> ORDER CONFIRMED </p>{" "}
        <h1>Thank You for Your Order</h1>{" "}
        <p className="order-description">
          {" "}
          Your order has been successfully placed. We appreciate your
          purchase.{" "}
        </p>{" "}
        <div className="order-info-card">
          {" "}
          <div className="order-info-row">
            {" "}
            <span>Order Number</span> <strong>#{order.id}</strong>{" "}
          </div>{" "}
          <div className="order-info-row">
            {" "}
            <span>Status</span> <strong>{order.status}</strong>{" "}
          </div>{" "}
          <div className="order-info-row">
            {" "}
            <span>Order Date</span>{" "}
            <strong>
              {" "}
              {new Date(order.created_at).toLocaleDateString()}{" "}
            </strong>{" "}
          </div>{" "}
          <div className="order-info-row order-total-row">
            {" "}
            <span>Total Amount</span>{" "}
            <strong>
              {" "}
              PKR {Number(order.total_amount).toLocaleString()}{" "}
            </strong>{" "}
          </div>{" "}
        </div>{" "}
        <div className="order-customer-card">
          {" "}
          <div className="order-section-heading">
            {" "}
            <p>DELIVERY INFORMATION</p>{" "}
            <h2>Customer & Shipping Details</h2>{" "}
          </div>{" "}
          <div className="order-customer-grid">
            {" "}
            <div className="order-customer-field">
              {" "}
              <span>Full Name</span> <strong>{order.full_name}</strong>{" "}
            </div>{" "}
            <div className="order-customer-field">
              {" "}
              <span>Email</span> <strong>{order.email}</strong>{" "}
            </div>{" "}
            <div className="order-customer-field">
              {" "}
              <span>Phone</span> <strong>{order.phone}</strong>{" "}
            </div>{" "}
            <div className="order-customer-field">
              {" "}
              <span>City</span> <strong>{order.city}</strong>{" "}
            </div>{" "}
            <div className="order-customer-field order-address-field">
              {" "}
              <span>Delivery Address</span>{" "}
              <strong>{order.address}</strong>{" "}
            </div>{" "}
            <div className="order-customer-field">
              {" "}
              <span>Postal Code</span> <strong>{order.postal_code}</strong>{" "}
            </div>{" "}
            <div className="order-customer-field">
              {" "}
              <span>Payment Method</span>{" "}
              <strong>
                {" "}
                {order.payment_method === "cash_on_delivery"
                  ? "Cash on Delivery"
                  : order.payment_method}{" "}
              </strong>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className="order-items">
          {" "}
          <h2>Order Items</h2>{" "}
          {items.map((item) => (
            <div className="order-item" key={item.id}>
              {" "}
              <div>
                {" "}
                <h3>{item.product_name}</h3>{" "}
                <p> Quantity: {item.quantity} </p>{" "}
              </div>{" "}
              <strong>
                {" "}
                PKR{" "}
                {(
                  Number(item.price) * Number(item.quantity)
                ).toLocaleString()}{" "}
              </strong>{" "}
            </div>
          ))}{" "}
        </div>{" "}
        <div className="order-actions">
          {" "}
          <Link to="/products" className="order-action-btn">
            {" "}
            Continue Shopping{" "}
          </Link>{" "}
          <Link to="/orders" className="order-secondary-btn">
            {" "}
            My Orders{" "}
          </Link>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  );
}
export default OrderDetails;
