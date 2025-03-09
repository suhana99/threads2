// OrderSuccess.jsx
import React from "react";
import { useLocation } from "react-router-dom";

const OrderSuccess = () => {
  const location = useLocation();

  return (
    <div>
      <h2 style={{padding:'25px 0px 5px 120px'}}>Order Placed Successfully!</h2>
    </div>
  );
};

export default OrderSuccess;

