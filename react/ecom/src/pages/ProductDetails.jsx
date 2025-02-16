import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody } from 'reactstrap';
import { Link} from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/products/products/")
      .then(response => setProducts(response.data))
      .catch(error => console.error(error));
  }, []);
  console.log("print",products)
  return (
    <div>
      <h2>Product List</h2>
      <ul>
        {products.map(product => (
          <Card>
          <div className="package__img">
            <img src={product.product_image} style={{maxHeight:"250px",minHeight:"250px"}}/>
            {/* {featured && <span className="featured-badge">Featured</span>} Show featured badge if applicable */}
          </div>
  
          <CardBody>
            <div className="card__top d-flex align-items-center justify-content-between">
              <span className="package__location d-flex align-items-center gap-1">
                <i className='ri-map-pin-line'></i> {product.category_name}
              </span>
            </div>
  
            <h5 className='package__title'>
              <Link to={`/products/${product.id}`}>{product.product_name}</Link>
            </h5>
            
            <p className='package__description' style={{maxHeight:"60px",minHeight:"60px"}}>{product.product_description}</p> {/* Displaying description */}
            <div className="card__details d-flex justify-content-between mt-2">
              <span>Stock: {product.stock}</span>
            </div>
  
            <div className="card__bottom d-flex align-items-center justify-content-between mt-3">
              <h5>${product.product_price} <span></span></h5>
              <Link to={`/products/${product.id}`}>
                <button className='booking__btn'>View details</button> {/* Book Now button */}
              </Link>
            </div>
          </CardBody>
        </Card>

        ))}
      </ul>
    </div>
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
    <div>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
    </div>
  );
};


export { ProductList, ProductDetail };
