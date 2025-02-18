import React, { useState, useEffect } from "react";
import CommonSection from "../shared/CommonSection";
import "../styles/product.css";
import { Col, Container, Row } from "reactstrap";
import { BASE_URL } from "../utils/config";
import axios from "axios";
import { ProductCard } from "./ProductDetails";

const Products = () => {
  const [products, setProducts] = useState([]); // ✅ Ensure products is always an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
  
      try {
        const response = await axios.get(`${BASE_URL}/products/products/?page=${page}`);
        
        console.log("API Full Response:", response.data); // ✅ Check structure
  
        setProducts(response.data); // ✅ Use response.data directly (since it's an array)
        setPageCount(response.data.total_pages || 1); 
  
        console.log("Fetched Products after update:", response.data);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, [page]);
  
  
  // ✅ Confirm state update
  useEffect(() => {
    console.log("Updated State - Products:", products);
  }, [products]);
  

  console.log("Fetched products:", products); // ✅ Debugging

  return (
    <>
      <CommonSection title={"All products"} />

      <section className="pt-0">
        <Container>
          {loading && <h4 className="text-center pt-5">LOADING..........</h4>}
          {error && <h4 className="text-center pt-5">{error}</h4>}

          {!loading && !error && products.length > 0 ? (
            <Row>
              {products.map((product)=> (
                <Col lg="3" md="6" sm="6" className="my-5" key={product.id}> 
                  <ProductCard product={product}/>
                </Col>
              ))}

              <Col lg="12">
                <div className="pagination d-flex align-items-center justify-content-center mt-4 gap-3">
                  {[...Array(pageCount).keys()].map((number) => (
                    <span
                      key={number}
                      onClick={() => setPage(number)}
                      className={page === number ? "active__page" : ""}
                    >
                      {number + 1}
                    </span>
                  ))}
                </div>
              </Col>
            </Row>
          ) : (
            !loading && !error && <h4 className="text-center pt-5">No Products Found</h4>
          )}
        </Container>
      </section>
    </>
  );
};

export default Products;
