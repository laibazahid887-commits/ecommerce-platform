import { Link } from "react-router-dom";
function Footer() {
  return (
    <footer className="footer">
      {" "}
      {/* Main Footer */}{" "}
      <div className="footer-main">
        {" "}
        {/* Brand / About */}{" "}
        <div className="footer-brand">
          {" "}
          <Link to="/" className="footer-logo">
            {" "}
            PAK<span>DEALS</span>{" "}
          </Link>{" "}
          <p>
            {" "}
            Discover carefully selected watches designed for everyday style,
            timeless appeal, and confident moments.{" "}
          </p>{" "}
          <Link to="/about" className="footer-about-link">
            {" "}
            More About PakDeals →{" "}
          </Link>{" "}
        </div>{" "}
        {/* Quick Links */}{" "}
        <div className="footer-column">
          {" "}
          <h3>Quick Links</h3> <Link to="/">Home</Link>{" "}
          <Link to="/products"> Watches </Link>{" "}
          <Link to="/categories"> Categories </Link>{" "}
          <Link to="/about"> About Us </Link>{" "}
          <Link to="/contact"> Contact </Link>{" "}
        </div>{" "}
        {/* Customer */}{" "}
        <div className="footer-column">
          {" "}
          <h3>Customer</h3> <Link to="/cart"> Shopping Cart </Link>{" "}
          <Link to="/orders"> My Orders </Link>{" "}
          <Link to="/login"> My Account </Link>{" "}
          <Link to="/products"> Explore Watches </Link>{" "}
        </div>{" "}
        {/* Contact */}{" "}
        <div className="footer-contact">
          {" "}
          <h3>Contact</h3>{" "}
          <div className="footer-contact-item">
            {" "}
            <span>Email</span>{" "}
            <a href="mailto:laibazahid887@gmail.com">
              {" "}
              laibazahid887@gmail.com{" "}
            </a>{" "}
          </div>{" "}
          <div className="footer-contact-item">
            {" "}
            <span>Phone</span> <a href="tel:03217952275"> 03029110146 </a>{" "}
          </div>{" "}
          <div className="footer-contact-item">
            {" "}
            <span>Location</span>{" "}
            <p> Mian Park, Jhumra Road, Jaranwala, Faisalabad </p>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Footer Bottom */}{" "}
      <div className="footer-bottom">
        {" "}
        <p> © 2026 PakDeals. All rights reserved. </p>{" "}
        <div className="footer-bottom-links">
          {" "}
          <Link to="/about"> About </Link>{" "}
          <Link to="/contact"> Contact </Link>{" "}
        </div>{" "}
      </div>{" "}
    </footer>
  );
}
export default Footer;
