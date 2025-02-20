import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Shop from '../pages/Shop'
import {ProductDetail} from '../pages/ProductDetails'
import Products from '../pages/Products'
import Login from '../pages/Login'
import Register from '../pages/Register'
import SearchResultList from '../shared/SearchResultList'

const Routers = () =>{
    return(
        <Routes>
            <Route path='/' element={<Shop />}/>
            <Route path='/products' element={<Products/>}/>
            <Route path='/product/:id' element={<ProductDetail/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/products/search' element={<SearchResultList/>} />
        </Routes>
    )
}

export default Routers