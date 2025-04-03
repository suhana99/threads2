import './App.css';
import Layout from './components/Layout/Layout'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AOS from 'aos';
import 'aos/dist/aos.css';
import React from 'react';


function App() {
  React.useEffect(() => {
    AOS.init({  //aos.init bhanne line is needed compulsorily otherwise elements with aos wont show at all.
      offset: 100, //animation will start 100px before it enters the viewpoint
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Layout />
    </>
  );
}

export default App;
