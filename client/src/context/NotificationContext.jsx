import { createContext, useContext, useState } from "react";
const NotificationContext = createContext();
function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const addNotification = (message, type = "success") => {
    const id = Date.now();
    setNotifications((current) => [...current, { id, message, type }]);
    setTimeout(() => {
      setNotifications((current) =>
        current.filter((notification) => notification.id !== id),
      );
    }, 4000);
  };
  const removeNotification = (id) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id),
    );
  };
  const clearNotifications = () => {
    setNotifications([]);
  };
  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
      }}
    >
      {" "}
      {children}{" "}
    </NotificationContext.Provider>
  );
}
export function useNotifications() {
  return useContext(NotificationContext);
}
export default NotificationContext;
export { NotificationProvider };
