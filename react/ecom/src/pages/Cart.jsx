import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Button, Card, CardBody, Input } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [selectedItems, setSelectedItems] = useState([]); // To track selected items
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/carts/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data && Array.isArray(response.data.items)) {
          setCartItems(response.data.items);
        } else {
          setCartItems([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
        setCartItems([]);
        setLoading(false);
      });
  }, []);

  // Remove a single item
  const handleRemoveItem = async (cartId) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`http://127.0.0.1:8000/cart/${cartId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Item removed successfully!");
      setCartItems(cartItems.filter((item) => item.id !== cartId));
    } catch (error) {
      console.error("Error removing item:", error);
      setMessage("Failed to remove item. Try again.");
    }
  };

  // Handle checkbox selection
  const handleCheckboxChange = (id) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id]
    );
  };

  // Bulk remove items
  const handleBulkRemove = async () => {
    for (let id of selectedItems) {
      await handleRemoveItem(id);
    }
    setSelectedItems([]); // Reset selection
  };

  if (loading) return <p className="cart-message">Loading cart...</p>;

  return (
    <Container>
      <h1 className="cart-title">🛒 Your Cart</h1>
      {error && <p className="cart-error">{error}</p>}
      {message && <p className="cart-message">{message}</p>}

      {cartItems.length === 0 ? (
        <p>
          Your cart is empty. <Link to="/products">Continue Shopping</Link>
        </p>
      ) : (
        <>
          {cartItems.map((item) => (
            <Card key={item.id} className="cart-item-card">
              <CardBody>
                <div className="cart-item">
                  {/* Checkbox */}
                  <Input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleCheckboxChange(item.id)}
                  />

                  {/* Tiny Image */}
                  <img
                    src={item.product?.product_image || "default.jpg"}
                    alt={item.product?.product_name || "Product"}
                    className="cart-item-img"
                  />

                  {/* Product Name (Clickable) */}
                  <h3
                    className="cart-item-name"
                    onClick={() => navigate(`/product/${item.product.id}`)}
                    style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                  >
                    {item.product?.product_name || "Unnamed Product"}
                  </h3>

                  {/* Price */}
                  <p>Price: ${item.product?.product_price || "N/A"}</p>

                  {/* Remove & Buy Now Buttons */}
                  <div className="cart-buttons">
                    <Button color="danger" onClick={() => handleRemoveItem(item.id)}>
                      Remove
                    </Button>
                    <Button color="success" onClick={() => navigate(`/checkout/${item.product.id}`)}>
                      Buy Now
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}

          {/* Bulk Remove Button */}
          {selectedItems.length > 0 && (
            <Button color="danger" className="bulk-remove-btn" onClick={handleBulkRemove}>
              Remove Selected Items
            </Button>
          )}
        </>
      )}
    </Container>
  );
};

export default Cart;
