import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardBody, Container, Row, Col, Button, Form, FormGroup} from 'reactstrap';
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
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/products/products/${id}/`)
      .then(response => setProduct(response.data))
      .catch(error => console.error(error));

    axios.get(`http://127.0.0.1:8000/products/products/${id}/reviews/`)
      .then(response => setReviews(response.data))
      .catch(error => console.error(error));
  }, [id]);

  const handleAddToCart = async (productId) => {
    if (!token) {
      alert("You need to log in first!");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/carts/add/${productId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        navigate('/cart');
      } else {
        alert(data.error);
        navigate('/cart');
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Something went wrong. Try again!");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("You need to log in to submit a review!");
      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/products/products/${id}/reviews/`,
        newReview,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews([...reviews, response.data]);
      setNewReview({ rating: 5, comment: "" });
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <Container>
      <Row>
        <Col lg="6" md="6" sm="12">
          <div className="product__content">
            <img src={product.product_image} alt={product.product_name} style={{ maxHeight: "1050px" }} />
          </div>
        </Col>

        <Col lg="6" md="6" sm="12">
          <div className="product__info">
            <h1>{product.product_name}</h1>
            <h6 className="my-3 pb-3">{product.product_description}</h6>
            <div className="product__extra-details">
              <h6>Price: ${product.product_price}</h6>
              <h6>Available stock: {product.stock}</h6>
            </div>
            <Button onClick={() => handleAddToCart(product.id)} disabled={loading} style={{backgroundColor:"rgb(195, 120, 70)"}}>
              {loading ? "Adding..." : "Add to Cart"}
            </Button>
          </div>

          {/* Review Section - Appears Below Product Info */}
          <div className="product__reviews mt-5">
            <h2>Customer Reviews</h2>
            
            {/* Display Existing Reviews */}
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="review">
                  <strong>{review.user.username}</strong>
                  <p>Rating: {review.rating} ⭐</p>
                  <p>{review.comment}</p>
                  <hr />
                </div>
              ))
            ) : (
              <p>No reviews yet. Be the first to review!</p>
            )}

            {/* Review Submission Form (Only for Authenticated Users) */}
            {token && (
              <form onSubmit={handleReviewSubmit} className="mt-3">
              <div className="form-group">
                <label>Rating</label>
                <select
                  className="form-control"
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>{num} ⭐</option>
                  ))}
                </select>
              </div>
            
              <div className="form-group mt-2">
                <label>Comment</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                ></textarea>
              </div>
            
              <button type="submit" className="btn mt-3" style={{backgroundColor:"rgb(195, 120, 70)", color:"white"}}>
                Submit Review
              </button>
            </form>            
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};


export { ProductCard, ProductDetail };
