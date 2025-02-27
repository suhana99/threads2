import React from 'react';
import './search-bar.css';
import { Col, Form, FormGroup } from 'reactstrap';
import { BASE_URL } from '../utils/config';
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SearchBar = () => {
  const searchRef = useRef('');
  const navigate = useNavigate();
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);

  const searchHandler = async (e) => {
    e.preventDefault();
    const searchTerm = searchRef.current.value.trim();

    if (!searchTerm) {
      alert("Please enter a search term.");
      return;
    }

    try {
      const queryString = `search=${encodeURIComponent(searchTerm)}`;
      const res = await fetch(`${BASE_URL}/products/products/?${queryString}`);

      if (!res.ok) throw new Error("Something went wrong!");
      const result = await res.json();

      if (!result || result.length === 0) {
        alert("No results found!");
        return;
      }

      setSearchResults(result);
      navigate(`/products/search?term=${searchTerm}`, { state: result });
      window.location.reload();

      // Clear input field after search
      searchRef.current.value = "";
    } catch (error) {
      alert(error.message);
    }
  };


  useEffect(() => {
    if (location.state) {
      setSearchResults(location.state);
    }
  }, [location.state]);


  return (
    <div className="search__bar">
      <Form onSubmit={searchHandler}>
        <FormGroup className="form__group">
          <input
            type="text"
            placeholder="Search..."
            ref={searchRef}
            onKeyDown={(e) => e.key === 'Enter' && searchHandler(e)}
          />
          <button type="submit">
            <i className="ri-search-line"></i>
          </button>
        </FormGroup>
      </Form>
    </div>
  );
};

export default SearchBar;
