import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Button, Card, CardBody, Input } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/cart.css";

const Cart = ({ cartItems: initialCartItems }) => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
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
          const updatedItems = response.data.items.map((item) => ({
            ...item,
            quantity: item.quantity > 0 ? item.quantity : 1,
          }));
          setCartItems(updatedItems);
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

  const handleRemoveItem = async (cartId) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("No token found.");
        return;
      }

      const response = await axios.delete(`http://127.0.0.1:8000/carts/${cartId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 204 || response.status === 200) {
        setCartItems(cartItems.filter((item) => item.id !== cartId));
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error removing item:", error.response?.data || error.message);
    }
  };

  const handleQuantityChange = (id, newQuantity, stock) => {
    if (newQuantity < 1 || newQuantity > stock) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const updateQuantityInBackend = async (id, newQuantity) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.patch(
        `http://127.0.0.1:8000/carts/${id}/`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("No items selected for checkout!");
      return;
    }

    const selectedCartItems = cartItems
      .filter((item) => selectedItems.includes(item.id))
      .map((item) => ({
        id: item.id,
        name: item.product?.product_name || "Unnamed Product",
        price: item.product?.product_price || 0,
        quantity: item.quantity,
      }));

    console.log("Final Selected Items before navigating:", selectedCartItems);
    navigate("/checkout", { state: { selectedItems: selectedCartItems } });
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
          {cartItems.map((item) => {
            const stock = item.product?.stock || 1;
            const productPrice = item.product?.product_price || 0;
            const totalPrice = productPrice * item.quantity;

            return (
              <Card key={item.id} className="cart-item-card">
                <CardBody>
                  <div className="cart-item">
                    {/* Checkbox */}
                    <Input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() =>
                        setSelectedItems((prev) =>
                          prev.includes(item.id)
                            ? prev.filter((itemId) => itemId !== item.id)
                            : [...prev, item.id]
                        )
                      }
                    />

                    {/* Tiny Image */}
                    <img
                      src={item.product?.product_image || "default.jpg"}
                      alt={item.product?.product_name || "Product"}
                      onClick={() =>
                        navigate(`/product/${item.product?.id || "unknown"}`)
                      }
                      className="cart-item-img"
                    />

                    {/* Product Name */}
                    <h3
                      className="cart-item-name"
                      onClick={() =>
                        navigate(`/product/${item.product?.id || "unknown"}`)
                      }
                      style={{
                        cursor: "pointer",
                        color: "blue",
                        textDecoration: "underline",
                      }}
                    >
                      {item.product?.product_name || "Unnamed Product"}
                    </h3>

                    {/* Price */}
                    <p>Price: ${totalPrice.toFixed(2)}</p>

                    {/* Quantity Controls */}
                    <div className="quantity-controls">
                      <Button
                        color="secondary"
                        onClick={() => {
                          const newQuantity = item.quantity - 1;
                          if (newQuantity >= 1) {
                            handleQuantityChange(item.id, newQuantity, stock);
                            updateQuantityInBackend(item.id, newQuantity);
                          }
                        }}
                      >
                        -
                      </Button>

                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value, 10);
                          if (!isNaN(newQuantity) && newQuantity >= 1 && newQuantity <= stock) {
                            handleQuantityChange(item.id, newQuantity, stock);
                            updateQuantityInBackend(item.id, newQuantity);
                          }
                        }}
                        className="quantity-input"
                      />

                      <Button
                        color="secondary"
                        onClick={() => {
                          const newQuantity = item.quantity + 1;
                          if (newQuantity <= stock) {
                            handleQuantityChange(item.id, newQuantity, stock);
                            updateQuantityInBackend(item.id, newQuantity);
                          }
                        }}
                        disabled={item.quantity >= stock}
                      >
                        +
                      </Button>
                    </div>

                    {/* Stock Display */}
                    <p>Available Stock: {stock}</p>

                    {/* Remove & Buy Now Buttons */}
                    <div className="cart-buttons">
                      <Button color="danger" onClick={() => handleRemoveItem(item.id)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}

          {/* Checkout Button */}
          <Button color="primary" className="checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </Button>
        </>
      )}
    </Container>
  );
};

export default Cart;