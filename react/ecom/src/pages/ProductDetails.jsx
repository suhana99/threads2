import React, { useState, useRef, useEffect, useContext } from 'react';
import '../styles/tour-details.css';
import { Container, Row, Col, Form, ListGroup } from 'reactstrap';
import { useParams } from 'react-router-dom';
import calculateAvgRating from '../utils/avgRating';
import useFetch from '../hooks/useFetch';
import { BASE_URL } from '../utils/config';
import { AuthContext } from '../context/AuthContext';

const ProductDetails = () => {
    const { id } = useParams(); // Get product ID from URL
    const reviewMsgRef = useRef(null); // Reference for the review input
    const [productRating, setProductRating] = useState(null); // Store selected rating
    const { user } = useContext(AuthContext); // Get logged-in user

    // Fetch product details
    const { data: productData, loading: productLoading, error: productError } = useFetch(`${BASE_URL}/products/products/${id}/`);

    // Fetch reviews
    const { data: reviews, loading: reviewsLoading, error: reviewsError } = useFetch(`${BASE_URL}/products/products/${id}/reviews/`);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    // Extract product details
    const { product_image: photo, product_name: title, product_description: desc, price, stock, category } = productData || {};
    console.log("fetched data",productData)
    // Calculate average rating
    const { totalRating, avgRating } = calculateAvgRating(reviews);

    // Handle review submission
    const submitHandler = async (e) => {
        e.preventDefault();
        const reviewText = reviewMsgRef.current.value;

        if (!user) {
            alert('Please sign in');
            return;
        }

        const reviewObj = {
            username: user.username,
            reviewText,
            rating: productRating,
        };

        try {
            const res = await fetch(`${BASE_URL}/products/products/${id}/reviews/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                mode: "cors",
                credentials: 'include',
                body: JSON.stringify(reviewObj),
            });

            const result = await res.json();
            if (!res.ok) {
                alert(result.message);
            } else {
                alert(result.message);
                window.location.reload(); // Refresh reviews after submission
            }
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [productData]);

    return (
        <section>
            <Container>
                {productLoading && <h4 className='text-center pt-5'>LOADING...</h4>}
                {productError && <h4 className='text-center pt-5'>{productError}</h4>}

                {!productLoading && !productError && (
                    <Row>
                        <Col lg='8'>
                            <div className="tour__content">
                                <img src={photo} alt={title} className="product-image" />

                                <div className="tour__info">
                                    <h2>{title}</h2>
                                    <div className="d-flex align-items-center gap-5">
                                        <span className="tour__rating d-flex align-items-center gap-1">
                                            <i className='ri-star-fill' style={{ color: 'var(--secondary-color)' }}></i> 
                                            {avgRating || "Not rated"} ({reviews?.length} reviews)
                                        </span>
                                    </div>

                                    <div className="tour__extra-details">
                                        <span><i className='ri-map-pin-2-line'></i> Category: {category}</span>
                                        <span><i className='ri-money-dollar-circle-line'></i> ${price}</span>
                                        <span><i className='ri-map-pin-2-line'></i> Stock: {stock} left</span>  
                                    </div>
                                    <h5>Description</h5>
                                    <p>{desc}</p>
                                </div>

                                {/* ============ REVIEWS SECTION ============ */}
                                <div className="tour__reviews mt-4">
                                    <h4>Reviews ({reviews?.length} reviews)</h4>

                                    <Form onSubmit={submitHandler}>
                                        <div className="d-flex align-items-center gap-3 mb-4 rating__group">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span key={star} onClick={() => setProductRating(star)}>
                                                    {star} <i className='ri-star-s-fill'></i>
                                                </span>
                                            ))}
                                        </div>

                                        <div className="review__input">
                                            <input type="text" ref={reviewMsgRef} placeholder='Share your thoughts' required />
                                            <button className='btn primary__btn text-white' type='submit'>
                                                Submit
                                            </button>
                                        </div>
                                    </Form>

                                    <ListGroup className='user__reviews'>
                                        {reviewsLoading && <h5>Loading reviews...</h5>}
                                        {reviewsError && <h5>{reviewsError}</h5>}
                                        {reviews?.map(review => (
                                            <div className="review__item" key={review.id}>
                                                <div className="w-100">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <div>
                                                            <h5>{review.username}</h5>
                                                            <p>{new Date(review.date_added).toLocaleDateString('en-US', options)}</p>
                                                        </div>
                                                        <span className='d-flex align-items-center'>
                                                            {review.rating}<i className='ri-star-s-fill'></i>
                                                        </span>
                                                    </div>
                                                    <h6>{review.comment}</h6>
                                                </div>
                                            </div>
                                        ))}
                                    </ListGroup>
                                </div>
                                {/* ============ REVIEWS SECTION END ============ */}
                            </div>
                        </Col>
                    </Row>
                )}
            </Container>
        </section>
    );
};

export default ProductDetails;
 