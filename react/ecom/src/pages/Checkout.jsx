import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Button, Input, Form, FormGroup, Label } from "reactstrap";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

const STRIPE_PUBLIC_KEY = "pk_test_51Qffv9Klirj7tM4tuQ6CglnFb3RWhn7S25NWGSGOaY7Es8nOk7qyorFaVKzcpH3nxEOk3I9YFPiSBT1pQ7PDVeWi00DAFuAkbZ";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedItems = location.state?.selectedItems || [];

  const [orderData, setOrderData] = useState({
    contact_no: "",
    address: "",
    payment_method: "Cash on Delivery",
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
    e.preventDefault(); // Prevent default form submission
    console.log("Submit button clicked!"); // Debugging log

    const token = localStorage.getItem("access_token");
    console.log("Token:", token);
    console.log("Selected Items:", selectedItems);
    console.log("Order Data:", orderData);

    try {
        const response = await axios.post(
            "http://127.0.0.1:8000/create-order/",
            {
                products: selectedItems.map((item) => item.id),
                quantities: selectedItems.map((item) => item.quantity),
                total_price: totalPrice,
                payment_method: orderData.payment_method,
                contact_no: orderData.contact_no,
                address: orderData.address,
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        console.log("Response received:", response.data); // Log API response

        if (orderData.payment_method === "Cash on Delivery") {
            alert("Order placed successfully!");
            navigate("/order-success", { state: { orderId: response.data.order_id } });
        } else if (orderData.payment_method === "Stripe") {
            const stripe = await loadStripe(STRIPE_PUBLIC_KEY);
            const { error } = await stripe.redirectToCheckout({ sessionId: response.data.id });

            if (error) {
                console.error("Stripe error:", error);
                navigate("/order-failed");
            }
        }
    } catch (error) {
        console.error("Order error:", error.response ? error.response.data : error.message);
    }
};

  return (
    <Container>
      <h2>Checkout</h2>
      <p>Total Price: ${totalPrice}</p>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="contact_no">Contact No</Label>
          <Input
            type="text"
            name="contact_no"
            required
            value={orderData.contact_no}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="address">Address</Label>
          <Input
            type="text"
            name="address"
            required
            value={orderData.address}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="payment_method">Payment Method</Label>
          <Input
            type="select"
            name="payment_method"
            value={orderData.payment_method}
            onChange={handleChange}
          >
            <option value="Cash on Delivery">Cash on Delivery</option>
            <option value="Stripe">Stripe</option>
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