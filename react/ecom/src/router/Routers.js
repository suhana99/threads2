import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Shop from '../pages/Shop'
import {ProductDetail} from '../pages/ProductDetails'
import Products from '../pages/Products'
import Login from '../pages/Login'
import Register from '../pages/Register'
import SearchResultList from '../shared/SearchResultList'
import CategoryPage from '../pages/CategoryPage'
import Cart from '../pages/Cart'

const Routers = () =>{
    return(
        <Routes>
            <Route path='/' element={<Shop />}/>
            <Route path='/products' element={<Products/>}/>
            <Route path='/product/:id' element={<ProductDetail/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/products/search' element={<SearchResultList/>} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/cart" element={<Cart/>} />
        </Routes>
    )
}

export default Routers