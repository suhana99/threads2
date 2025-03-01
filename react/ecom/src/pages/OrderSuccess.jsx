// OrderSuccess.jsx
import React from "react";
import { useLocation } from "react-router-dom";

const OrderSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div>
      <h2>Order Placed Successfully!</h2>
      <p>Your order ID is: {orderId}</p>
    </div>
  );
};

export default OrderSuccess;

