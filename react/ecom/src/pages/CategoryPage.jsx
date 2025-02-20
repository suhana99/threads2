import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CategoryPage = () => {
   const { id } = useParams();
   console.log("Category ID:", id);

   const [products, setProducts] = useState([]);

   useEffect(() => {
      const fetchProducts = async () => {
         try {
            const response = await fetch(`http://127.0.0.1:8000/products/products/?category_id=${id}/`);

            if (response.ok) {
               const data = await response.json();
               setProducts(data);
            }
         } catch (error) {
            console.error("Error fetching category products:", error);
         }
      };

      fetchProducts();
   }, [id]);

   return (
      <div>
         <h2>Products in Category {id}</h2>
         <ul>
            {products.map((product) => (
               <li key={product.id}>{product.name}</li>
            ))}
         </ul>
      </div>
   );
};

export default CategoryPage;
