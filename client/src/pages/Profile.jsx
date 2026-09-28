import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { useNotifications } from "../context/NotificationContext";
function Profile() {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const { addNotification } = useNotifications();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/me");
        const userData = response.data.data;
        setProfile(userData);
        setFormData({ name: userData.name || "", email: userData.email || "" });
        login(userData);
      } catch (error) {
        console.log(error);
        if (error.response?.status === 401) {
          logout();
          navigate("/login");
          return;
        }
        setError(
          error.response?.data?.message || "Unable to load your profile.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    try {
      setSaving(true);
      const response = await api.put("/auth/profile", formData);
      const updatedUser = response.data.data;
      setProfile(updatedUser);
      setFormData({ name: updatedUser.name, email: updatedUser.email });
      login(updatedUser);
      setSuccess("Profile updated successfully.");
      addNotification("Profile updated successfully.", "success");
    } catch (error) {
      console.log(error);
      const message =
        error.response?.data?.message || "Unable to update your profile.";
      setError(message);
      addNotification(message, "error");
    } finally {
      setSaving(false);
    }
  };
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  if (loading) {
    return (
      <section className="profile-page">
        {" "}
        <div className="profile-message">
          {" "}
          <p>Loading your profile...</p>{" "}
        </div>{" "}
      </section>
    );
  }
  if (error && !profile) {
    return (
      <section className="profile-page">
        {" "}
        <div className="profile-message">
          {" "}
          <h2>Unable to load profile</h2> <p>{error}</p>{" "}
        </div>{" "}
      </section>
    );
  }
  return (
    <section className="profile-page">
      {" "}
      <div className="profile-header">
        {" "}
        <p className="profile-subtitle">YOUR ACCOUNT</p> <h1>My Profile</h1>{" "}
        <p> Manage your account information and preferences. </p>{" "}
      </div>{" "}
      <div className="profile-layout">
        {" "}
        <div className="profile-card">
          {" "}
          <div className="profile-card-header">
            {" "}
            <div className="profile-avatar">
              {" "}
              {profile?.name?.charAt(0).toUpperCase()}{" "}
            </div>{" "}
            <div>
              {" "}
              <p>ACCOUNT</p> <h2>{profile?.name}</h2>{" "}
              <span>{profile?.email}</span>{" "}
            </div>{" "}
          </div>{" "}
          <div className="profile-account-info">
            {" "}
            <div>
              {" "}
              <span>Account ID</span> <strong>#{profile?.id}</strong>{" "}
            </div>{" "}
            <div>
              {" "}
              <span>Role</span>{" "}
              <strong>
                {" "}
                {profile?.role === "admin" ? "Administrator" : "Customer"}{" "}
              </strong>{" "}
            </div>{" "}
          </div>{" "}
          <div className="profile-actions">
            {" "}
            <button type="button" onClick={() => navigate("/orders")}>
              {" "}
              My Orders{" "}
            </button>{" "}
            <button type="button" onClick={() => navigate("/cart")}>
              {" "}
              Shopping Cart{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
        <div className="profile-edit-card">
          {" "}
          <div className="profile-section-heading">
            {" "}
            <p>PERSONAL INFORMATION</p> <h2>Edit Profile</h2>{" "}
          </div>{" "}
          {error && <p className="auth-error"> {error} </p>}{" "}
          {success && <p className="auth-success"> {success} </p>}{" "}
          <form onSubmit={handleSubmit}>
            {" "}
            <div className="profile-form-group">
              {" "}
              <label htmlFor="name"> Full Name </label>{" "}
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />{" "}
            </div>{" "}
            <div className="profile-form-group">
              {" "}
              <label htmlFor="email"> Email Address </label>{" "}
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />{" "}
            </div>{" "}
            <button
              type="submit"
              className="profile-save-btn"
              disabled={saving}
            >
              {" "}
              {saving ? "Saving Changes..." : "Save Changes"}{" "}
            </button>{" "}
          </form>{" "}
          <div className="profile-divider"></div>{" "}
          <div className="profile-danger-area">
            {" "}
            <div>
              {" "}
              <p>ACCOUNT ACCESS</p> <h3>Sign Out</h3>{" "}
              <span> Sign out of your WatchStore account. </span>{" "}
            </div>{" "}
            <button
              type="button"
              onClick={handleLogout}
              className="profile-logout-btn"
            >
              {" "}
              Logout{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  );
}
export default Profile;
