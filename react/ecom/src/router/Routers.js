import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Shop from '../pages/Shop'
import {ProductDetail} from '../pages/ProductDetails'
import Login from '../pages/Login'
import Register from '../pages/Register'

const Routers = () =>{
    return(
        <Routes>
            <Route path='/' element={<Shop />}/>
            <Route path='/product/:id' element={<ProductDetail/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
        </Routes>
    )
}

export default Routers