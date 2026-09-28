import { useEffect, useState } from "react";
import "../styles/AdminMessages.css";
import api from "../services/api";
function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get("/contact");
        setMessages(response.data.data || []);
      } catch (error) {
        console.log(error);
        setError(
          error.response?.data?.message || "Unable to load contact messages.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);
  if (loading) {
    return (
      <section className="admin-messages-page">
        {" "}
        <h1>Contact Messages</h1> <p>Loading messages...</p>{" "}
      </section>
    );
  }
  if (error) {
    return (
      <section className="admin-messages-page">
        {" "}
        <h1>Contact Messages</h1> <p>{error}</p>{" "}
      </section>
    );
  }
  return (
    <section className="admin-messages-page">
      {" "}
      <div className="admin-page-header">
        {" "}
        <div>
          {" "}
          <p className="admin-page-eyebrow">CUSTOMER COMMUNICATION</p>{" "}
          <h1>Contact Messages</h1>{" "}
          <p>View messages submitted through the website contact form.</p>{" "}
        </div>{" "}
      </div>{" "}
      {messages.length === 0 ? (
        <div className="admin-empty-state">
          {" "}
          <h2>No messages yet</h2>{" "}
          <p>Customer contact messages will appear here.</p>{" "}
        </div>
      ) : (
        <div className="admin-messages-list">
          {" "}
          {messages.map((message) => (
            <article className="admin-message-card" key={message.id}>
              {" "}
              <div className="admin-message-header">
                {" "}
                <div>
                  {" "}
                  <h2>{message.name}</h2>{" "}
                  <a href={`mailto:${message.email}`}> {message.email} </a>{" "}
                </div>{" "}
                <span>
                  {" "}
                  {new Date(message.created_at).toLocaleString()}{" "}
                </span>{" "}
              </div>{" "}
              <div className="admin-message-content">
                {" "}
                <p>{message.message}</p>{" "}
              </div>{" "}
            </article>
          ))}{" "}
        </div>
      )}{" "}
    </section>
  );
}
export default AdminMessages;
