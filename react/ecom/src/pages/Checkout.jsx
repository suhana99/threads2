import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Button, Input, Form, FormGroup, Label } from "reactstrap";
import axios from "axios";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedItems = location.state?.selectedItems || [];

  const [orderData, setOrderData] = useState({
    contact_no: "",
    address: "",
    payment_method: "Esewa",
  });

  // Redirect if no items are passed
  if (!selectedItems.length) {
    navigate("/cart");
    return null;
  }

  // Calculate total price
  const totalPrice = selectedItems.reduce((total, item) => {
    return total + (item.price || 0) * (item.quantity || 1);
  }, 0);

  // Handle input change
  const handleChange = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };

  // Handle order submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    try {
      await axios.post(
        "http://127.0.0.1:8000/myorder/",
        {
          user: localStorage.getItem("user_id"),
          products: selectedItems.map((item) => item.id),
          total_price: totalPrice,
          contact_no: orderData.contact_no,
          address: orderData.address,
          payment_method: orderData.payment_method,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      console.error("Order error:", error);
    }
  };

  return (
    <Container>
      <h2>Checkout</h2>
      <p>Total Price: ${totalPrice}</p>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="contact_no">Contact No</Label>
          <Input type="text" name="contact_no" required value={orderData.contact_no} onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <Label for="address">Address</Label>
          <Input type="text" name="address" required value={orderData.address} onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <Label for="payment_method">Payment Method</Label>
          <Input type="select" name="payment_method" value={orderData.payment_method} onChange={handleChange}>
            <option value="Esewa">Esewa</option>
            <option value="Khalti">Khalti</option>
            <option value="Paypal">Paypal</option>
          </Input>
        </FormGroup>
        <Button color="primary" type="submit">
          Place Order
        </Button>
      </Form>
    </Container>
  );
};

export default Checkout;