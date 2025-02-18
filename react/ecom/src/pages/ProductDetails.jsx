import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, Container, Row, Col, Form, ListGroup } from 'reactstrap';
import { Link} from 'react-router-dom';
import '../styles/productcard.css'
import '../styles/product-details.css'

// const ProductList = () => {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     axios.get("http://127.0.0.1:8000/products/products/")
//       .then(response => setProducts(response.data))
//       .catch(error => console.error(error));
//   }, []);
//   console.log("print",products)
//   return (
//     <div>
//       <h2>Product List</h2>
//       <ul>
//         {products.map(product => (
//         <Link to={`/products/${product.id}`} style={{ textDecoration: "none"}}> 
//          <Card>
//           <div className="product__img">
//             <img src={product.product_image} style={{maxHeight:"250px",minHeight:"250px"}}/>
//           </div>
  
//           <CardBody>
//             <h5 className='product__title'>
//               {product.product_name}
//             </h5>

//             <div className="card__top d-flex align-items-center justify-content-between">
//               <span className="product__location d-flex align-items-center gap-1">
//                Category :  {product.category_name}
//               </span>
//             </div>
  
            
//             <p className='product__description' style={{maxHeight:"60px",minHeight:"60px"}}>{product.product_description}</p> {/* Displaying description */}
//             <div className="card__details d-flex justify-content-between mt-2">
//               <span>Stock: {product.stock}</span>
//             </div>
  
//             <div className="card__bottom d-flex align-items-center justify-content-between mt-3">
//               <h5>${product.product_price} <span></span></h5>
//               <Link to={`/products/${product.id}`}>
//                 <button className='booking__btn'>View details</button> {/* Book Now button */}
//               </Link>
//             </div>
//           </CardBody>
//         </Card>
//         </Link>
//         ))}
//       </ul>
//     </div>
//   );
// };

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

          <p className="product__description" style={{ maxHeight: "150px", minHeight: "150px" }}>
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

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/products/products/${id}/`)
      .then(response => setProduct(response.data))
      .catch(error => console.error(error));
  }, [id]);

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
          </div>
        </Col>
      </Row>
    </Container>
  );  
};


export { ProductCard, ProductDetail };
