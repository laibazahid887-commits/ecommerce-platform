import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
function Navbar() {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const closeMenu = () => {
    setMenuOpen(false);
  };
  const handleLogout = () => {
    logout();
    setAccountOpen(false);
    setMenuOpen(false);
  };
  const handleSearch = () => {
    navigate("/products");
    setMenuOpen(false);
  };
  return (
    <>
      {" "}
      {/* Announcement Bar */}{" "}
      <div className="announcement-bar">
        {" "}
        <span>FREE SHIPPING ON ORDERS OVER PKR 5,000</span>{" "}
        <span className="announcement-dot">•</span> <span>SECURE CHECKOUT</span>{" "}
        <span className="announcement-dot">•</span>{" "}
        <span>AUTHENTIC TIMEPIECES</span>{" "}
      </div>{" "}
      {/* Main Navbar */}{" "}
      <nav className="navbar">
        {" "}
        <div className="navbar-container">
          {" "}
          {/* Logo */}{" "}
          <Link to="/" className="navbar-brand" onClick={closeMenu}>
            {" "}
            Pak<span>Deals</span>{" "}
          </Link>{" "}
          {/* Desktop Navigation */}{" "}
          <div className="navbar-links">
            {" "}
            <Link to="/">Home</Link> <Link to="/products">Watches</Link>{" "}
            <Link to="/categories">Categories</Link>{" "}
            <Link to="/about">About</Link>{" "}
          </div>{" "}
          {/* Navbar Actions */}{" "}
          <div className="navbar-actions">
            {" "}
            {/* Search */}{" "}
            <button
              type="button"
              className="navbar-icon-btn"
              aria-label="Search"
              onClick={handleSearch}
            >
              {" "}
              <span>⌕</span>{" "}
            </button>{" "}
            {/* Cart */}{" "}
            <Link to="/cart" className="navbar-cart" aria-label="Shopping Cart">
              {" "}
              <span className="navbar-cart-icon">🛒</span>{" "}
              <span className="navbar-cart-text">Cart</span>{" "}
            </Link>{" "}
            {/* Account */}{" "}
            {isLoggedIn ? (
              <div className="navbar-account">
                {" "}
                <button
                  type="button"
                  className="navbar-account-btn"
                  onClick={() => setAccountOpen(!accountOpen)}
                >
                  {" "}
                  <span className="account-icon">◯</span>{" "}
                  <span className="account-name"> {user.name} </span>{" "}
                  <span
                    className={`account-arrow ${accountOpen ? "open" : ""}`}
                  >
                    {" "}
                    ↓{" "}
                  </span>{" "}
                </button>{" "}
                {accountOpen && (
                  <div className="account-dropdown">
                    {" "}
                    <div className="account-dropdown-header">
                      {" "}
                      <span>ACCOUNT</span> <strong>{user.name}</strong>{" "}
                    </div>{" "}
                    <div className="account-dropdown-divider"></div>{" "}
                    <Link to="/profile" onClick={() => setAccountOpen(false)}>
                      {" "}
                      My Profile{" "}
                    </Link>{" "}
                    <Link to="/orders" onClick={() => setAccountOpen(false)}>
                      {" "}
                      My Orders{" "}
                    </Link>{" "}
                    <Link to="/cart" onClick={() => setAccountOpen(false)}>
                      {" "}
                      Shopping Cart{" "}
                    </Link>{" "}
                    <button type="button" onClick={handleLogout}>
                      {" "}
                      Logout{" "}
                    </button>{" "}
                  </div>
                )}{" "}
              </div>
            ) : (
              <Link to="/login" className="navbar-login">
                {" "}
                Sign In{" "}
              </Link>
            )}{" "}
            {/* Mobile Menu Button */}{" "}
            <button
              type="button"
              className={`mobile-menu-btn ${menuOpen ? "active" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {" "}
              <span></span> <span></span>{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
        {/* Mobile Navigation */}{" "}
        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          {" "}
          <Link to="/" onClick={closeMenu}>
            {" "}
            Home{" "}
          </Link>{" "}
          <Link to="/products" onClick={closeMenu}>
            {" "}
            Watches{" "}
          </Link>{" "}
          <Link to="/categories" onClick={closeMenu}>
            {" "}
            Categories{" "}
          </Link>{" "}
          <Link to="/about" onClick={closeMenu}>
            {" "}
            About{" "}
          </Link>{" "}
          <div className="mobile-menu-divider"></div>{" "}
          <button type="button" onClick={handleSearch}>
            {" "}
            Search Watches{" "}
          </button>{" "}
          <Link to="/cart" onClick={closeMenu}>
            {" "}
            Shopping Cart{" "}
          </Link>{" "}
          {isLoggedIn ? (
            <>
              {" "}
              <Link to="/profile" onClick={closeMenu}>
                {" "}
                My Profile{" "}
              </Link>{" "}
              <Link to="/orders" onClick={closeMenu}>
                {" "}
                My Orders{" "}
              </Link>{" "}
              <button type="button" onClick={handleLogout}>
                {" "}
                Logout{" "}
              </button>{" "}
            </>
          ) : (
            <Link to="/login" onClick={closeMenu}>
              {" "}
              Sign In{" "}
            </Link>
          )}{" "}
        </div>{" "}
      </nav>{" "}
    </>
  );
}
export default Navbar;
