import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Button, Card, CardBody, Input } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/cart.css";
import { FaTrash } from "react-icons/fa";

const Cart = ({ cartItems: initialCartItems }) => {
  const [cartItems, setCartItems] = useState(initialCartItems || []);
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
          setCartItems(response.data.items.map((item) => ({
            ...item,
            quantity: item.quantity > 0 ? item.quantity : 1,
          })));
        } else {
          setCartItems([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
        setError("Failed to load cart items. Please try again.");
        setCartItems([]);
        setLoading(false);
      });
  }, [initialCartItems]);

  const handleRemoveItem = async (cartItemId) => {  
    try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        console.log("Deleting cart item with ID:", cartItemId);

        const response = await axios.delete(`http://127.0.0.1:8000/carts/remove/${cartItemId}/`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {  
            setCartItems(cartItems.filter((item) => item.id !== cartItemId));  
        }
    } catch (error) {
        console.log("Failed to remove item with ID:", cartItemId);
        console.error("Error:", error.response?.data || error.message);
        setError("Failed to remove item.");
    }
};


const handleQuantityChange = async (product_id, newQuantity, stock) => {
  if (newQuantity < 1 || newQuantity > stock) return;

  // Update the quantity locally
  setCartItems((prevItems) =>
    prevItems.map((item) =>
      item.product_id === product_id ? { ...item, quantity: newQuantity } : item
    )
  );

  // Update the quantity on the backend
  await updateQuantityInBackend(product_id, newQuantity);
};

const updateQuantityInBackend = async (product_id, newQuantity) => {
  try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const response = await axios.patch(
          `http://127.0.0.1:8000/carts/${product_id}/`, 
          { quantity: newQuantity },
          { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
          console.log("Quantity updated successfully on the backend.");
      }
   } 
  catch (error) {
      // Log the full error to understand what went wrong
      // console.error("Error updating quantity:", error);
      // console.error("Error response:", error.response);  // Log the response if available
      // setError("Failed to update quantity.");
  }
};


  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("No items selected for checkout!");
      return;
    }

    const selectedCartItems = cartItems
      .filter((item) => selectedItems.includes(item.product_id))
      .map((item) => ({
        product_id: item.product_id,
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
      <h1 className="cart-title mt-4 mb-4">🛒 Your Cart</h1>
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
              <Card key={item.product_id} className="cart-item-card mt-4">
                <CardBody>
                  <div className="cart-item">
                    {/* Checkbox */}
                    <Input
                      type="checkbox"
                      checked={selectedItems.includes(item.product_id)}
                      onChange={() =>
                        setSelectedItems((prev) =>
                          prev.includes(item.product_id)
                            ? prev.filter((itemId) => itemId !== item.product_id)
                            : [...prev, item.product_id]
                        )
                      }
                    />

                    <img
                      src={item.product?.product_image || "default.jpg"}
                      alt={item.product?.product_name || "Product"}
                      onClick={() => navigate(`/product/${item.product?.id || "unknown"}`)}
                      className="cart-item-img"
                    />

                    {/* Product Name */}
                    <h4
                      className="cart-item-name"
                      onClick={() => navigate(`/product/${item.product?.id || "unknown"}`)}
                      style={{ cursor: "pointer" }}
                    >
                      {item.product?.product_name || "Unnamed Product"}
                    </h4>

                    {/* Price */}
                    <h5 style={{ marginLeft: "1%", marginRight: "5%" }}>
                      Price: ${totalPrice.toFixed(2)}
                    </h5>

                    <div className="quantity-controls">
                      <Button
                        className="btn-dark"
                        onClick={() => handleQuantityChange(item.product_id, item.quantity - 1, stock)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>

                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value, 10);
                          if (!isNaN(newQuantity) && newQuantity >= 1 && newQuantity <= stock) {
                            handleQuantityChange(item.product_id, newQuantity, stock);
                          }
                        }}
                        className="quantity-input"
                      />

                      <Button
                        className="btn-dark"
                        onClick={() => handleQuantityChange(item.product_id, item.quantity + 1, stock)}
                        disabled={item.quantity >= stock}
                      >
                        +
                      </Button>
                    </div>

                    {/* Remove Button */}
                    <Button className="btn-dark" onClick={() => handleRemoveItem(item.id)}>
                      <FaTrash />
                    </Button>
                  </div>
                </CardBody>
              </Card>
            );
          })}

          {/* Checkout Button */}
          <Button className="checkout-btn mt-4" onClick={handleCheckout}>
            Proceed to Checkout
          </Button>
        </>
      )}
    </Container>
  );
};

export default Cart;
