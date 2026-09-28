import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState("0.00");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingItem, setUpdatingItem] = useState(null);
  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/cart");
      setCart(response.data.data.cart);
      setItems(response.data.data.items || []);
      setTotalAmount(response.data.data.total_amount);
    } catch (error) {
      console.log(error);
      if (error.response?.status === 404) {
        setCart(null);
        setItems([]);
        setTotalAmount("0.00");
      } else {
        setError(error.response?.data?.message || "Unable to load your cart.");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCart();
  }, []);
  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) {
      return;
    }
    try {
      setUpdatingItem(itemId);
      await api.put(`/cart/items/${itemId}`, { quantity });
      await fetchCart();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Unable to update quantity.");
    } finally {
      setUpdatingItem(null);
    }
  };
  const removeItem = async (itemId) => {
    try {
      setUpdatingItem(itemId);
      await api.delete(`/cart/items/${itemId}`);
      await fetchCart();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Unable to remove product.");
    } finally {
      setUpdatingItem(null);
    }
  };
  if (loading) {
    return (
      <section className="cart-page">
        {" "}
        <div className="cart-header">
          {" "}
          <p className="cart-subtitle">YOUR SHOPPING BAG</p>{" "}
          <h1>Shopping Cart</h1>{" "}
        </div>{" "}
        <div className="cart-message">
          {" "}
          <p>Loading your cart...</p>{" "}
        </div>{" "}
      </section>
    );
  }
  if (error && !cart) {
    return (
      <section className="cart-page">
        {" "}
        <div className="cart-header">
          {" "}
          <p className="cart-subtitle">YOUR SHOPPING BAG</p>{" "}
          <h1>Shopping Cart</h1>{" "}
        </div>{" "}
        <div className="cart-message">
          {" "}
          <h2>Unable to load cart</h2> <p>{error}</p>{" "}
          <button className="cart-action-btn" onClick={fetchCart}>
            {" "}
            Try Again{" "}
          </button>{" "}
        </div>{" "}
      </section>
    );
  }
  if (!cart || items.length === 0) {
    return (
      <section className="cart-page">
        {" "}
        <div className="cart-header">
          {" "}
          <p className="cart-subtitle">YOUR SHOPPING BAG</p>{" "}
          <h1>Shopping Cart</h1>{" "}
          <p>Review your selected watches before checkout.</p>{" "}
        </div>{" "}
        <div className="cart-empty">
          {" "}
          <div className="cart-empty-icon">🛒</div>{" "}
          <p className="cart-empty-label">YOUR BAG IS WAITING</p>{" "}
          <h2>Your cart is empty</h2>{" "}
          <p> Explore our collection and discover a timepiece made for you. </p>{" "}
          <Link to="/products" className="cart-action-btn">
            {" "}
            Explore Watches{" "}
          </Link>{" "}
        </div>{" "}
      </section>
    );
  }
  const totalItems = items.reduce(
    (total, item) => total + Number(item.quantity),
    0,
  );
  return (
    <section className="cart-page">
      {" "}
      <div className="cart-header">
        {" "}
        <p className="cart-subtitle">YOUR SHOPPING BAG</p>{" "}
        <h1>Shopping Cart</h1>{" "}
        <p> Review your selected watches before checkout. </p>{" "}
      </div>{" "}
      {error && (
        <div className="cart-message cart-error">
          {" "}
          <p>{error}</p>{" "}
        </div>
      )}{" "}
      <div className="cart-layout">
        {" "}
        <div className="cart-items">
          {" "}
          <div className="cart-items-header">
            {" "}
            <span>YOUR ITEMS ({totalItems})</span>{" "}
            <Link to="/products"> Continue Shopping → </Link>{" "}
          </div>{" "}
          {items.map((item) => {
            const subtotal = Number(item.price) * Number(item.quantity);
            return (
              <article className="cart-item" key={item.id}>
                {" "}
                <div className="cart-item-image">
                  {" "}
                  {item.image ? (
                    <img src={`/images/${item.image}`} alt={item.name} />
                  ) : (
                    <span>WATCH</span>
                  )}{" "}
                </div>{" "}
                <div className="cart-item-info">
                  {" "}
                  <p className="cart-item-category">
                    {" "}
                    Premium Collection{" "}
                  </p>{" "}
                  <h2>{item.name}</h2>{" "}
                  <p className="cart-item-price">
                    {" "}
                    PKR {Number(item.price).toLocaleString()}{" "}
                  </p>{" "}
                  <div className="cart-item-controls">
                    {" "}
                    <div className="quantity-control">
                      {" "}
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, Number(item.quantity) - 1)
                        }
                        disabled={
                          updatingItem === item.id || Number(item.quantity) <= 1
                        }
                      >
                        {" "}
                        −{" "}
                      </button>{" "}
                      <span>{item.quantity}</span>{" "}
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, Number(item.quantity) + 1)
                        }
                        disabled={
                          updatingItem === item.id ||
                          Number(item.quantity) >= Number(item.stock)
                        }
                      >
                        {" "}
                        +{" "}
                      </button>{" "}
                    </div>{" "}
                    <button
                      type="button"
                      className="remove-item-btn"
                      onClick={() => removeItem(item.id)}
                      disabled={updatingItem === item.id}
                    >
                      {" "}
                      {updatingItem === item.id ? "Updating..." : "Remove"}{" "}
                    </button>{" "}
                  </div>{" "}
                  <p className="cart-item-subtotal">
                    {" "}
                    Subtotal{" "}
                    <strong> PKR {subtotal.toLocaleString()} </strong>{" "}
                  </p>{" "}
                </div>{" "}
              </article>
            );
          })}{" "}
        </div>{" "}
        <aside className="cart-summary">
          {" "}
          <p className="cart-summary-label"> ORDER SUMMARY </p>{" "}
          <h2>Cart Summary</h2>{" "}
          <div className="summary-row">
            {" "}
            <span>Items</span> <span>{totalItems}</span>{" "}
          </div>{" "}
          <div className="summary-row">
            {" "}
            <span>Shipping</span> <span>Free</span>{" "}
          </div>{" "}
          <div className="summary-divider"></div>{" "}
          <div className="summary-total">
            {" "}
            <span>Total</span>{" "}
            <strong> PKR {Number(totalAmount).toLocaleString()} </strong>{" "}
          </div>{" "}
          <button
            type="button"
            className="checkout-btn"
            onClick={() => navigate("/checkout")}
          >
            {" "}
            Proceed to Checkout{" "}
          </button>{" "}
          <p className="checkout-note">
            {" "}
            Secure checkout • Fast order processing{" "}
          </p>{" "}
        </aside>{" "}
      </div>{" "}
    </section>
  );
}
export default Cart;
