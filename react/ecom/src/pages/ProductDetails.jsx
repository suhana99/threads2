import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardBody, Container, Row, Col, Button} from 'reactstrap';
import { getCsrfToken } from "../utils/csrf";
import '../styles/productcard.css'
import '../styles/product-details.css'



const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <Card>
        <div className="product__img">
          <img
            src={product.product_image}
            alt={product.product_name}
            style={{ maxHeight: "350px", minHeight: "350px" }}
          />
        </div>

        <CardBody>
          <h1 className="product__title">{product.product_name}</h1>

          <div className="card__top d-flex align-items-center justify-content-between">
            <span className="product__location d-flex align-items-center gap-1">
              Category: {product.category_name}
            </span>
          </div>

          <p className="product__description mb-4" style={{ maxHeight: "100px", minHeight: "100px" }}>
            {product.product_description}
          </p>

          <div className="card__details d-flex justify-content-between mt-2">
            <span>Stock: {product.stock}</span>
          </div>

          <div className="card__bottom d-flex align-items-center justify-content-between mt-3">
            <h5>${product.product_price}</h5>
            <Link to={`/product/${product.id}`}>
              <button className="booking__btn">View details</button>
            </Link>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
};




const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/products/products/${id}/`)
      .then(response => setProduct(response.data))
      .catch(error => console.error(error));
  }, [id]);

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("You need to log in first!");
        return;
      }
  
      const response = await fetch(`http://127.0.0.1:8000/carts/add/${productId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert(data.message); // Show success message
        navigate('/cart')
      } else {
        alert(data.error); // Show error message if product is already in cart
        navigate('/cart')
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Something went wrong. Try again!");
    }
  };
  

  if (!product) return <p>Loading...</p>;

  return (
    <Container>
      <Row>
        <Col lg="6" md="6" sm="12">
          <div className="product__content">
            <img src={product.product_image} alt={product.product_name} style={{ maxHeight: "550px" }} />
          </div>
        </Col>
  
        <Col lg="6" md="6" sm="12">
          <div className="product__info">
            <h1>{product.product_name}</h1>
            <h6 className="my-3 pb-3">{product.product_description}</h6>
            
            {/* Optional: Rating section if needed */}
            {/* <div className="d-flex align-items-center gap-5">
              <span className="product__rating d-flex align-items-center gap-1">
                <i className="ri-star-fill" style={{ color: "var(--secondary-color)" }}></i> 
                {avgRating === 0 ? null : avgRating}
                {avgRating === 0 ? "Not rated" : <span>({reviews?.length})</span>}
              </span>
            </div>  */}
  
            <div className="product__extra-details">
              <h6>Price: ${product.product_price}</h6>
              <h6>Available stock: {product.stock}</h6>
            </div>
            <Button onClick={() => handleAddToCart(product.id)} disabled={loading} style={{backgroundColor:"rgb(195, 120, 70)"}}>
              {loading ? "Adding..." : "Add to Cart"}
            </Button>

            {/* Message Display */}
            {message && <p>{message}</p>}
          </div>
           
        </Col>
      </Row>
    </Container>
  );  
};


export { ProductCard, ProductDetail };
