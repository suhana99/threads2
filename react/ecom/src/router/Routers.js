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
import Checkout from '../pages/Checkout'
import OrderSuccess from '../pages/OrderSuccess'
import OrderFailed from '../pages/OrderFailed'

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
            <Route path="/checkout" element={<Checkout/>}/>
            <Route path="/order-success" element={<OrderSuccess/>}/>
            <Route path='/order-failed' element={<OrderFailed/>}/>
        </Routes>
    )
}

export default Routers