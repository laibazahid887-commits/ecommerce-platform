import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { useNotifications } from "../context/NotificationContext";
function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { addNotification } = useNotifications();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data.data);
      } catch (error) {
        console.log(error);
        setError(error.response?.data?.message || "Unable to load product.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);
  const handleAddToCart = async () => {
    setCartMessage("");
    setError("");
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    try {
      setAddingToCart(true);
      await api.post("/cart");
      await api.post("/cart/items", { product_id: product.id, quantity: 1 });
      addNotification("Watch added to your cart.", "success");
      setCartMessage("Watch added to your cart.");
    } catch (error) {
      console.log(error);
      const message =
        error.response?.data?.message || "Unable to add watch to cart.";
      setError(message);
      addNotification(message, "error");
    } finally {
      setAddingToCart(false);
    }
  };
  if (loading) {
    return (
      <section className="product-details-page">
        {" "}
        <h2>Loading product...</h2>{" "}
      </section>
    );
  }
  if (error && !product) {
    return (
      <section className="product-details-page">
        {" "}
        <h2>{error}</h2>{" "}
      </section>
    );
  }
  if (!product) {
    return (
      <section className="product-details-page">
        {" "}
        <h2>Product not found.</h2>{" "}
      </section>
    );
  }
  return (
    <section className="product-details-page">
      {" "}
      <div className="product-details-image">
        {" "}
        {product.image ? (
          <img src={`/images/${product.image}`} alt={product.name} />
        ) : (
          <span>WATCH</span>
        )}{" "}
      </div>{" "}
      <div className="product-details-content">
        {" "}
        <p className="product-category"> Premium Collection </p>{" "}
        <h1>{product.name}</h1>{" "}
        <p className="product-details-description">
          {" "}
          {product.description || "Premium timepiece with elegant design."}{" "}
        </p>{" "}
        <div className="product-details-price">
          {" "}
          PKR {Number(product.price).toLocaleString()}{" "}
        </div>{" "}
        <p className="product-details-stock">
          {" "}
          {product.stock > 0
            ? `${product.stock} available`
            : "Out of Stock"}{" "}
        </p>{" "}
        {cartMessage && <p className="cart-success-message"> {cartMessage} </p>}{" "}
        {error && <p className="auth-error"> {error} </p>}{" "}
        <button
          className="add-cart-btn"
          onClick={handleAddToCart}
          disabled={product.stock <= 0 || addingToCart}
        >
          {" "}
          {addingToCart ? "Adding to Cart..." : "Add to Cart"}{" "}
        </button>{" "}
        {cartMessage && (
          <Link to="/cart" className="view-cart-btn">
            {" "}
            View Cart{" "}
          </Link>
        )}{" "}
      </div>{" "}
    </section>
  );
}
export default ProductDetails;
