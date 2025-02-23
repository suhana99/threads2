import React, { useEffect, useRef, useContext, useState } from 'react';
import { Container, Row, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import './header.css';
import { AuthContext } from '../../context/AuthContext';
import SearchBar from '../../shared/SearchBar';

const Header = () => {
   const headerRef = useRef(null);
   const menuRef = useRef(null);
   const navigate = useNavigate();
   const { user } = useContext(AuthContext);
   const [categories, setCategories] = useState([]);
   const [dropdownOpen, setDropdownOpen] = useState(false);

   const nav__links = [
      { path: '/', display: 'Home' },
      { path: '/products', display: 'Products' },
   ];

   if (user) {
      nav__links.push({ path: '/history', display: 'History' });
   }

   useEffect(() => {
      const fetchCategories = async () => {
         try {
            const response = await fetch('http://127.0.0.1:8000/products/products/categories/'); 
            console.log("response",response)
            if (response.ok) {
               const data = await response.json();
               setCategories(data);
            }
         } catch (error) {
            console.error("Error fetching categories:", error);
         }
      };
      fetchCategories();
   }, []);

   const stickyHeaderFunc = () => {
      window.addEventListener('scroll', () => {
         if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
            headerRef.current.classList.add('sticky__header');
         } else {
            headerRef.current.classList.remove('sticky__header');
         }
      });
   };

   useEffect(() => {
      stickyHeaderFunc();
      return () => window.removeEventListener('scroll', stickyHeaderFunc);
   }, []);

   const toggleMenu = () => menuRef.current.classList.toggle('show__menu');
   const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

   const logout = () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");

      navigate('/');
      window.location.reload();
   };

   return (
      <header className="header" ref={headerRef}>
         <Container>
            <Row>
               <div className="nav__wrapper d-flex align-items-center justify-content-between">
                  {/* Navigation Menu */}
                  <div className="navigation" ref={menuRef} onClick={toggleMenu}>
                     <ul className="menu d-flex align-items-center gap-5">
                        {nav__links.map((item, index) => (
                           <li className="nav__item" key={index}>
                              <NavLink to={item.path} className={({ isActive }) => isActive ? 'active__link' : ''}>
                                 {item.display}
                              </NavLink>
                           </li>
                        ))}
                        {/* Categories Dropdown */}
                        <li className="nav__item">
                           <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                              <DropdownToggle caret className="category-dropdown">
                                 Categories
                              </DropdownToggle>
                              <DropdownMenu>
                                 {categories.map((category, index) => (
                                    <DropdownItem key={index} onClick={() => navigate(`/category/${category.id}`)}>
                                       {category.category_name}
                                    </DropdownItem>
                                 ))}
                              </DropdownMenu>
                           </Dropdown>
                        </li>
                     </ul>
                  </div>

                  {/* Search Bar */}
                  <div className="search-bar">
                     <SearchBar />
                  </div>

                  {/* Right Section (Login/Logout) */}
                  <div className="nav__right d-flex align-items-center gap-4">
                     <div className="nav__btns d-flex align-items-center gap-2">
                        {user ? (
                           <>
                              <Button className="btn btn-dark" onClick={logout}>
                                 Logout
                              </Button>
                           </>
                        ) : (
                           <>
                              <Button className="btn secondary__btn" onClick={() => navigate('/login')}>
                                 Login
                              </Button>
                              <Button className="btn primary__btn" onClick={() => navigate('/register')}>
                                 Register
                              </Button>
                           </>
                        )}
                     </div>

                     <span className="mobile__menu" onClick={toggleMenu}>
                        <i className="ri-menu-line"></i>
                     </span>
                  </div>
               </div>
            </Row>
         </Container>
      </header>
   );
};

export default Header;
