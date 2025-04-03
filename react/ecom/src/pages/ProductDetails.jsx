import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardBody, Container, Row, Col, Button, Form, FormGroup} from 'reactstrap';
import { getCsrfToken } from "../utils/csrf";
import '../styles/productcard.css'
import '../styles/product-details.css'
import AOS from 'aos';
import 'aos/dist/aos.css';



const ProductCard = ({ product }) => {
  useEffect(() => {
    AOS.init({ duration: 800, once: false }); // Ensures animations trigger every time
    AOS.refresh(); // Refresh AOS to detect new elements
  }, []);
  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div className="container mt-[50px]">
      <div className="flex flex-wrap justify-center gap-10">
        <div
              data-aos="zoom-in"
              className="rounded-2xl bg-white hover:bg-black/80 relative shadow-xl duration-300 group"
            >
      {/* <Card className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4"> */}
      <div className="h-[290px] w-[250px]">
                <img
                  src={product.product_image}
                  alt=""
                  className="rounded-t-2xl w-100 h-100 block mx-auto transform -translate-y-20 group-hover:scale-105 duration-300 drop-shadow-md"
                />
              </div>

          <div className="p-2 pt-0 mt-[-50px] text-center w-[250px]">

          <h1 className="text-xl font-bold">{product.product_name}</h1>

          <p className="text-gray-500 duration-300 text-sm line-clamp-2">
                  {product.product_description}
          </p>

          <div className="card__details d-flex justify-content-between">
            <span><h6>Stock: {product.stock}</h6></span>
          </div>

          <div className="card__bottom d-flex align-items-center justify-content-between mt-3">
            <h5>${product.product_price}</h5>
          </div>
       </div>
      {/* </Card> */}
        </div>
      </div>
      </div>
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
      navigate("/login");
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
        // navigate('/cart');
      } else {
        alert(data.error);
        // navigate('/cart');
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
                  <h6>{review.username} : {review.rating} ⭐</h6>
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
