import { useState } from "react";
import "../styles/Contact.css";
import api from "../services/api";
function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setSubmitted(false);
    setError("");
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSending(true);
      setSubmitted(false);
      setError("");
      await api.post("/contact", formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.log(error);
      setError(
        error.response?.data?.message ||
          "Unable to send your message. Please try again.",
      );
    } finally {
      setSending(false);
    }
  };
  return (
    <main className="contact-page">
      {" "}
      <section className="contact-hero">
        {" "}
        <div className="contact-hero-content">
          {" "}
          <p className="contact-eyebrow">GET IN TOUCH</p>{" "}
          <h1>
            {" "}
            We'd love to <span>hear from you.</span>{" "}
          </h1>{" "}
          <p className="contact-hero-description">
            {" "}
            Have a question about a watch, your order, or our collection? We're
            here to help.{" "}
          </p>{" "}
        </div>{" "}
      </section>{" "}
      <section className="contact-content">
        {" "}
        <div className="contact-information">
          {" "}
          <div className="contact-section-heading">
            {" "}
            <p>CONTACT INFORMATION</p>{" "}
            <h2>
              {" "}
              Let's start a <span>conversation.</span>{" "}
            </h2>{" "}
          </div>{" "}
          <div className="contact-details">
            {" "}
            <div className="contact-detail">
              {" "}
              <span>EMAIL</span>{" "}
              <a href="mailto:laibazahid887@gmail.com">
                {" "}
                laibazahid887@gmail.com{" "}
              </a>{" "}
            </div>{" "}
            <div className="contact-detail">
              {" "}
              <span>PHONE</span> <a href="tel:03217952275">03029110146</a>{" "}
            </div>{" "}
            <div className="contact-detail">
              {" "}
              <span>LOCATION</span>{" "}
              <p>Mian Park, Jhumra Road, Jaranwala, Faisalabad</p>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className="contact-form-wrapper">
          {" "}
          <p className="contact-form-eyebrow">SEND US A MESSAGE</p>{" "}
          <h2>
            {" "}
            How can we <span>help?</span>{" "}
          </h2>{" "}
          {submitted && (
            <div className="contact-success">
              {" "}
              Thank you. Your message has been received.{" "}
            </div>
          )}{" "}
          {error && <div className="contact-error">{error}</div>}{" "}
          <form className="contact-form" onSubmit={handleSubmit}>
            {" "}
            <div className="contact-form-group">
              {" "}
              <label htmlFor="name">Your Name</label>{" "}
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />{" "}
            </div>{" "}
            <div className="contact-form-group">
              {" "}
              <label htmlFor="email">Email Address</label>{" "}
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
            <div className="contact-form-group">
              {" "}
              <label htmlFor="message">Message</label>{" "}
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message..."
                rows="6"
                required
              ></textarea>{" "}
            </div>{" "}
            <button
              type="submit"
              className="contact-submit-btn"
              disabled={sending}
            >
              {" "}
              {sending ? "Sending..." : "Send Message →"}{" "}
            </button>{" "}
          </form>{" "}
        </div>{" "}
      </section>{" "}
    </main>
  );
}
export default Contact;
