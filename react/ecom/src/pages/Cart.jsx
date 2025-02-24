import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import "../styles/cart.css"; 

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/carts/", { withCredentials: true }) // Ensure auth session
      .then((response) => {
        setCartItems(response.data.items);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
        setLoading(false);
      });
  }, []);

  const handleRemoveItem = async (cartId) => {
    try {
      await axios.get(`http://127.0.0.1:8000/remove-cart/${cartId}/`, {
        withCredentials: true,
      });
      setMessage("Item removed successfully");
      setCartItems(cartItems.filter((item) => item.id !== cartId)); // Update UI after removal
    } catch (error) {
      setMessage("Error removing item");
    }
  };

  if (loading) return <p>Loading cart...</p>;

  return (
    <Container>
      <h1 className="cart-title">🛒 Your Cart</h1>
      {message && <p className="cart-message">{message}</p>}

      {cartItems.length === 0 ? (
        <p>Your cart is empty. <Link to="/products">Continue Shopping</Link></p>
      ) : (
        <Row>
          {cartItems.map((item) => (
            <Col key={item.id} lg="4" md="6" sm="12">
              <Card>
                <div className="cart__img">
                  <img
                    src={item.product.product_image}
                    alt={item.product.product_name}
                    style={{ maxHeight: "200px" }}
                  />
                </div>
                <CardBody>
                  <h3>{item.product.product_name}</h3>
                  <p>Price: ${item.product.product_price}</p>
                  <Button color="danger" onClick={() => handleRemoveItem(item.id)}>
                     Remove
                  </Button>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Cart;
