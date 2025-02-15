import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Shop from '../pages/Shop'
import ProductDetails from '../pages/ProductDetails'

const Routers = () =>{
    return(
        <Routes>
            <Route path='/' element={<Shop />}/>
            {/* <Route path='/product/:id' element={<ProductDetails />} /> */}
        </Routes>
    )
}

export default Routers