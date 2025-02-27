import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Button, Input, Form, FormGroup, Label } from "reactstrap";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedItemIds = location.state?.selectedItems || [];

  

  const [orderData, setOrderData] = useState({
    contact_no: "",
    address: "",
    payment_method: "Esewa",
  });

  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("Received selectedItems in Checkout:", selectedItems);
  
  useEffect(() => {
    if (selectedItemIds.length === 0) {
      navigate("/cart");
      return;
    }

    const fetchSelectedItems = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://127.0.0.1:8000/carts/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && Array.isArray(response.data.items)) {
          // Filter only selected items
          const filteredItems = response.data.items.filter(item => selectedItemIds.includes(item.id));
          setSelectedItems(filteredItems);
        }
      } catch (error) {
        console.error("Error fetching selected items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSelectedItems();
  }, [selectedItemIds, navigate]);

  const totalPrice = selectedItems.reduce((total, item) => {
    return total + (item.product?.product_price || 0) * (item.quantity || 1);
  }, 0);
  
  const handleChange = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    try {
      await axios.post(
        "http://127.0.0.1:8000/myorder/",
        {
          user: localStorage.getItem("user_id"), // Ensure correct user ID
          products: selectedItems.map((item) => item.product.id),
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

  if (loading) return <p>Loading checkout...</p>;

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
