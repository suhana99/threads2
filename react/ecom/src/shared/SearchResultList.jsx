import React, { useState, useEffect } from 'react';
import CommonSection from './../shared/CommonSection';
import { Container, Row, Col } from 'reactstrap';
import { useLocation } from 'react-router-dom';
import { ProductCard } from '../pages/ProductDetails';
import "../styles/product.css";

const SearchResultList = () => {
  const location = useLocation();  // Access the location state passed from the search page
  const [data, setData] = useState(location.state || []);  // Initialize data with the state or empty array

  useEffect(() => {
    console.log("Search results:", location.state);  // Log the data
    if (!location.state || location.state.length === 0) {
      alert('No results found!');
    }
  }, [location.state]);

  return (
    <>
      <CommonSection title={'Product Search Result'} />
      <section>
        <Container>
          <Row>
            {
              data.length === 0
                ? <h4 className='text-center'>No Product Found</h4>
                : data.map((product) => (
                    <Col lg='3' className='mb-4' key={product.id}>  {/* Use unique id for key */}
                      <ProductCard product={product} />
                    </Col>
                  ))
            }
          </Row>
        </Container>
      </section>
    </>
  );
};

export default SearchResultList;
