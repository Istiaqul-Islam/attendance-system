// src/components/ui/Notification.js

import React from "react";
import Lottie from "lottie-react";
import { useNotification } from "../../context/NotificationContext";
import successAnimationData from "../../assets/animations/success-checkmark.json";
import "./Notification.scss";

const Notification = () => {
  const { notification, hideNotification } = useNotification();

  // If there's no notification in the context, render nothing.
  if (!notification) {
    return null;
  }

  const isSuccess = notification.type === "success";
  const notificationTypeClass = isSuccess ? "success" : "error";

  return (
    <div className={`notification-container ${notificationTypeClass}`}>
      {isSuccess ? (
        <div className="lottie-success-container">
          <Lottie
            animationData={successAnimationData}
            loop={false}
            style={{ width: 50, height: 50 }}
          />
          <p className="notification-message">{notification.message}</p>
        </div>
      ) : (
        <p className="notification-message">{notification.message}</p>
      )}

      <button onClick={hideNotification} className="notification-close-btn">
        &times;
      </button>
    </div>
  );
};

export default Notification;
