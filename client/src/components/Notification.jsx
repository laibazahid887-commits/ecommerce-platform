import { useNotifications } from "../context/NotificationContext";
function Notification() {
  const { notifications, removeNotification } = useNotifications();
  return (
    <div className="notification-container">
      {" "}
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
        >
          {" "}
          <div className="notification-content">
            {" "}
            <span className="notification-icon">
              {" "}
              {notification.type === "success" && "✓"}{" "}
              {notification.type === "error" && "!"}{" "}
              {notification.type === "info" && "i"}{" "}
            </span>{" "}
            <p>{notification.message}</p>{" "}
          </div>{" "}
          <button
            type="button"
            className="notification-close"
            onClick={() => removeNotification(notification.id)}
            aria-label="Close notification"
          >
            {" "}
            ×{" "}
          </button>{" "}
        </div>
      ))}{" "}
    </div>
  );
}
export default Notification;
