import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
      );
      console.log("Register response:", response.data);
      setSuccess("Account created successfully!");
      setFormData({ name: "", email: "", password: "" });
      setLoading(false);
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.log(error);
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
      setLoading(false);
    }
  };
  return (
    <section className="auth-page">
      {" "}
      <div className="auth-card">
        {" "}
        <div className="auth-header">
          {" "}
          <p className="auth-subtitle">JOIN THE COLLECTION</p>{" "}
          <h1>Create Account</h1>{" "}
          <p>
            {" "}
            Create your account and start exploring our watch collection.{" "}
          </p>{" "}
        </div>{" "}
        <form onSubmit={handleSubmit}>
          {" "}
          <div className="form-group">
            {" "}
            <label>Full Name</label>{" "}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />{" "}
          </div>{" "}
          <div className="form-group">
            {" "}
            <label>Email</label>{" "}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />{" "}
          </div>{" "}
          <div className="form-group">
            {" "}
            <label>Password</label>{" "}
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              minLength="6"
            />{" "}
          </div>{" "}
          {error && <p className="auth-error"> {error} </p>}{" "}
          {success && <p className="auth-success"> {success} </p>}{" "}
          <button type="submit" className="auth-btn" disabled={loading}>
            {" "}
            {loading ? "Creating Account..." : "Create Account"}{" "}
          </button>{" "}
        </form>{" "}
        <p className="auth-footer">
          {" "}
          Already have an account? <Link to="/login">Sign in</Link>{" "}
        </p>{" "}
      </div>{" "}
    </section>
  );
}
export default Register;
