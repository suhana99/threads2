import React from 'react'
import Header from './../Header/Header'
import '../../styles/NoLayout.css'
import { useLocation } from 'react-router-dom'
import Routers from '../../router/Routers'
import Footer from './Footer/Footer'

const Layout = () => {
   const location = useLocation()
   
   const noLayoutRoutes = [
      
    ]
    
    const isNoLayoutRoute = noLayoutRoutes.some(route => 
      location.pathname.includes(route)
    )
   return (
      <>
         {!isNoLayoutRoute && <Header />}
         <Routers/>
         {!isNoLayoutRoute && <Footer />}   
      </>
   )
}

export default Layout