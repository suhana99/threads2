import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProductCard } from './ProductDetails';
import { Col, Container, Row } from "reactstrap";

const CategoryPage = () => {
   const { id } = useParams();
   console.log("Category ID:", id);
   const [products, setProducts] = useState([]);
   const [filteredProducts, setFilteredProducts] = useState([]);


   useEffect(() => {
      const fetchProducts = async () => {
         try {
            const response = await fetch(`http://127.0.0.1:8000/products/products/?category_id=${id}`);

            if (response.ok) {
               const data = await response.json();
               setProducts(data);
               console.log("fetched products", data)
            }
         } catch (error) {
            console.error("Error fetching category products:", error);
         }
      };

      fetchProducts();
   }, []);

   useEffect(() => {
      if (products.length > 0) {
         const filtered = products.filter(product => product.category === parseInt(id));
         setFilteredProducts(filtered);
      }
   }, [id, products]);

   return (
      <Container>
                     <h4 style={{margin:"30px 0px 30px 0px", display:"flex" ,justifyContent:"center", color:'rgb(120,80,90)'}}>Category: {filteredProducts.length > 0 ? filteredProducts[0]?.category_name : "Unknown"}</h4>

         <Row>
            {  
               filteredProducts.length === 0
                  ? <h4 className='text-center'>No Products Found</h4>
                  : filteredProducts.map((product) => (
                        <Col lg='3' className='mb-4' key={product.id}> 
                           <ProductCard product={product} />
                        </Col>
                     ))
            }
         </Row>
      </Container>
   );
};

export default CategoryPage;
