import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useNotifications } from "../context/NotificationContext";
function Checkout() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [cart, setCart] = useState(null);
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState("0.00");
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    payment_method: "cash_on_delivery",
  });
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await api.get("/cart");
        setCart(response.data.data.cart);
        setItems(response.data.data.items || []);
        setTotalAmount(response.data.data.total_amount);
      } catch (error) {
        console.log(error);
        setError(error.response?.data?.message || "Unable to load your cart.");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setPlacingOrder(true);
      setError("");
      const response = await api.post("/cart/checkout", formData);
      console.log("Checkout response:", response.data);
      const order = response.data.data.order;
      addNotification("Order placed successfully.", "success");
      navigate(`/orders/${order.id}`);
    } catch (error) {
      console.log(error);
      const message =
        error.response?.data?.message ||
        "Unable to place your order. Please try again.";
      setError(message);
      addNotification(message, "error");
    } finally {
      setPlacingOrder(false);
    }
  };
  if (loading) {
    return (
      <main className="checkout-page">
        {" "}
        <div className="checkout-header">
          {" "}
          <p className="checkout-subtitle"> SECURE CHECKOUT </p>{" "}
          <h1>Checkout</h1>{" "}
        </div>{" "}
        <div className="checkout-message">
          {" "}
          <p>Loading your order...</p>{" "}
        </div>{" "}
      </main>
    );
  }
  if (error && !cart) {
    return (
      <main className="checkout-page">
        {" "}
        <div className="checkout-header">
          {" "}
          <p className="checkout-subtitle"> SECURE CHECKOUT </p>{" "}
          <h1>Checkout</h1>{" "}
        </div>{" "}
        <div className="checkout-message">
          {" "}
          <h2>Unable to load checkout</h2> <p>{error}</p>{" "}
        </div>{" "}
      </main>
    );
  }
  if (!cart || items.length === 0) {
    return (
      <main className="checkout-page">
        {" "}
        <div className="checkout-header">
          {" "}
          <p className="checkout-subtitle"> SECURE CHECKOUT </p>{" "}
          <h1>Checkout</h1>{" "}
        </div>{" "}
        <div className="checkout-message">
          {" "}
          <h2>Your cart is empty</h2>{" "}
          <p> Add a watch to your cart before proceeding to checkout. </p>{" "}
          <button
            type="button"
            className="checkout-back-btn"
            onClick={() => navigate("/products")}
          >
            {" "}
            Explore Watches{" "}
          </button>{" "}
        </div>{" "}
      </main>
    );
  }
  return (
    <main className="checkout-page">
      {" "}
      <div className="checkout-header">
        {" "}
        <p className="checkout-subtitle"> SECURE CHECKOUT </p>{" "}
        <h1>Complete Your Order</h1>{" "}
        <p>
          {" "}
          Enter your details and delivery information to complete your
          purchase.{" "}
        </p>{" "}
      </div>{" "}
      {error && <div className="checkout-error"> {error} </div>}{" "}
      <div className="checkout-layout">
        {" "}
        <form className="checkout-form" onSubmit={handleSubmit}>
          {" "}
          <section className="checkout-section">
            {" "}
            <div className="checkout-section-heading">
              {" "}
              <span>01</span>{" "}
              <div>
                {" "}
                <p>YOUR DETAILS</p> <h2>Contact Information</h2>{" "}
              </div>{" "}
            </div>{" "}
            <div className="checkout-fields">
              {" "}
              <div className="checkout-field">
                {" "}
                <label htmlFor="full_name"> Full Name </label>{" "}
                <input
                  id="full_name"
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />{" "}
              </div>{" "}
              <div className="checkout-field">
                {" "}
                <label htmlFor="email"> Email Address </label>{" "}
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />{" "}
              </div>{" "}
              <div className="checkout-field">
                {" "}
                <label htmlFor="phone"> Phone Number </label>{" "}
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="03XX XXXXXXX"
                  required
                />{" "}
              </div>{" "}
            </div>{" "}
          </section>{" "}
          <section className="checkout-section">
            {" "}
            <div className="checkout-section-heading">
              {" "}
              <span>02</span>{" "}
              <div>
                {" "}
                <p>DELIVERY</p> <h2>Shipping Address</h2>{" "}
              </div>{" "}
            </div>{" "}
            <div className="checkout-fields">
              {" "}
              <div className="checkout-field checkout-field-full">
                {" "}
                <label htmlFor="address"> Address </label>{" "}
                <input
                  id="address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House / Street / Area"
                  required
                />{" "}
              </div>{" "}
              <div className="checkout-field">
                {" "}
                <label htmlFor="city">City</label>{" "}
                <input
                  id="city"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  required
                />{" "}
              </div>{" "}
              <div className="checkout-field">
                {" "}
                <label htmlFor="postal_code"> Postal Code </label>{" "}
                <input
                  id="postal_code"
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  placeholder="Postal code"
                  required
                />{" "}
              </div>{" "}
            </div>{" "}
          </section>{" "}
          <section className="checkout-section">
            {" "}
            <div className="checkout-section-heading">
              {" "}
              <span>03</span>{" "}
              <div>
                {" "}
                <p>PAYMENT</p> <h2>Payment Method</h2>{" "}
              </div>{" "}
            </div>{" "}
            <label className="payment-option">
              {" "}
              <input
                type="radio"
                name="payment_method"
                value="cash_on_delivery"
                checked={formData.payment_method === "cash_on_delivery"}
                onChange={handleChange}
              />{" "}
              <div>
                {" "}
                <strong>Cash on Delivery</strong>{" "}
                <span> Pay when your order arrives. </span>{" "}
              </div>{" "}
            </label>{" "}
          </section>{" "}
          <button
            type="submit"
            className="place-order-btn"
            disabled={placingOrder}
          >
            {" "}
            {placingOrder ? "Placing Order..." : "Place Order →"}{" "}
          </button>{" "}
        </form>{" "}
        <aside className="checkout-summary">
          {" "}
          <p className="checkout-summary-label"> YOUR ORDER </p>{" "}
          <h2>Order Summary</h2>{" "}
          <div className="checkout-summary-items">
            {" "}
            {items.map((item) => (
              <div className="checkout-summary-item" key={item.id}>
                {" "}
                <div className="checkout-summary-image">
                  {" "}
                  {item.image ? (
                    <img src={`/images/${item.image}`} alt={item.name} />
                  ) : (
                    <span>WATCH</span>
                  )}{" "}
                </div>{" "}
                <div className="checkout-summary-info">
                  {" "}
                  <h3>{item.name}</h3> <p>Qty: {item.quantity}</p>{" "}
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
          <div className="checkout-summary-divider"></div>{" "}
          <div className="checkout-summary-row">
            {" "}
            <span>Items</span>{" "}
            <span>
              {" "}
              {items.reduce(
                (total, item) => total + Number(item.quantity),
                0,
              )}{" "}
            </span>{" "}
          </div>{" "}
          <div className="checkout-summary-row">
            {" "}
            <span>Shipping</span> <span>Free</span>{" "}
          </div>{" "}
          <div className="checkout-summary-total">
            {" "}
            <span>Total</span>{" "}
            <strong> PKR {Number(totalAmount).toLocaleString()} </strong>{" "}
          </div>{" "}
        </aside>{" "}
      </div>{" "}
    </main>
  );
}
export default Checkout;
