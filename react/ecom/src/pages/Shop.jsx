import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faGift, faHouseChimney } from '@fortawesome/free-solid-svg-icons';
import { Carousel } from "react-bootstrap"; 
import React, {useRef} from 'react';
import '../styles/shop.css';
import { Col, Row } from 'reactstrap';
import Products from './Products';
import Slider from "react-slick";
import Image2 from '../assets/images/c.webp'
import Image3 from '../assets/images/c.jpeg'

const ImageList = [
  // {
  //   id: 1,
  //   img: Image1,
  //   title: "Upto 50% off on all Men's Wear",
  //   description:
  //     "lorem His Life will forever be Changed dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  // },
  {
    id: 2,
    img: Image2,
    title: "30% off on all Women's Wear",
    description:
      "Who's there lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: 3,
    img: Image3,
    title: "70% off on all Products Sale",
    description:
      "consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

const Shop = () => {
  const sliderRef = useRef(null); // Reference to the slider

  var settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 1000,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: "ease-in-out",
    pauseOnHover: false,
    pauseOnFocus: true,
  };

  
    return (
      <>
      <div
      className="relative overflow-hidden min-h-[550px] sm:min-h-[650px] bg-gray-100 flex justify-center items-center"
      onMouseDown={() => sliderRef.current?.slickPause()} // Pause when mouse is pressed
      onMouseUp={() => sliderRef.current?.slickPlay()} // Resume when mouse is released
    >
      <div className="h-[700px] w-[700px] bg-primary/40 absolute -top-1/2 right-0 rounded-3xl rotate-45 -z[8]"></div> 

      {/* hero section */}
      <div className="container pb-8 sm:pb-0">
        <Slider ref={sliderRef}{...settings}>
          {ImageList.map((data) => (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {/* text content section */}
                <div className="flex flex-col justify-center gap-4 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1 relative z-10">
                  <h1
                    data-aos="zoom-out"
                    data-aos-duration="500"
                    data-aos-once="true"
                    className="text-5xl sm:text-6xl lg:text-7xl font-bold"
                  >
                    {data.title}
                  </h1>
                  <p
                    data-aos="fade-up"
                    data-aos-duration="500"
                    data-aos-delay="100"
                    className="text-sm"
                  >
                    {data.description}
                  </p>
                  <div
                    data-aos="fade-up"
                    data-aos-duration="500"
                    data-aos-delay="300"
                  >
                  </div>
                </div>
                {/* image section */}
                <div className="order-1 sm:order-2">
                  <div
                    data-aos="zoom-in"
                    data-aos-once="true"
                    className="relative z-10"
                  >
                    <img
                      src={data.img}
                      alt=""
                      className="w-[300px] h-[300px] sm:h-[450px] sm:w-[450px] sm:scale-105 lg:scale-120 object-contain mx-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
        <Row>
        <Col xs={12} lg={12} md={12}>
            <h1 className="text-center" style={{marginTop:"30px"}}>Shop With Us</h1>
            <p className="text-center">Handpicked Favourites just for you</p>
        </Col>
        </Row>
          <div className="pro container-fluid">
            <div className="row ps-5">
              <div className="spr1 col-12 col-md-12 col-lg-4 mb-5">
                <div className="spring col-4 z-2">
                  <b>WOMEN</b><br />
                  Spring 2024
                </div>
                <div className="col-9 z-1">
                  <img src="https://preview.colorlib.com/theme/cozastore/images/banner-01.jpg" className="w-100" alt="Women Fashion" />
                </div>
              </div>
              <div className="spr2 col-12 col-md-12 col-lg-4 mb-5">
                <div className="spring col-4 z-2">
                  <b>MEN</b><br />
                  Spring 2024
                </div>
                <div className="col-9 z-1">
                  <img src="https://preview.colorlib.com/theme/cozastore/images/banner-02.jpg" className="w-100" alt="Men Fashion" />
                </div>
              </div>
              <div className="spr3 col-12 col-md-12 col-lg-4 mb-5">
                <div className="spring col-4 z-2">
                  <b>Accessories</b><br />
                  New Trend
                </div>
                <div className="col-9 z-1">
                  <img src="https://preview.colorlib.com/theme/cozastore/images/banner-03.jpg" className="w-100" alt="Accessories" />
                </div>
              </div>
            </div>
          </div>

        <div>
          <section className="mid mt-5 mb-5">
            <div className="mid-1 pt-5 pb-5 text-center">
              <div className="mid-2 d-flex justify-content-center">
                <FontAwesomeIcon icon={faBookOpen} className="bg-blue mb-3" />
              </div>
              <h4>Endless options</h4>
              <p>We stock over 200 different brands available for immediate delivery</p>
            </div>
            <div className="mid-1 pt-5 pb-5 text-center">
              <div className="mid-2 d-flex justify-content-center">
                <FontAwesomeIcon icon={faGift} className="bg-blue mb-3" />
              </div>
              <h4>Super Easy to order</h4>
              <p>You get to choose from multiple national and international online</p>
            </div>
            <div className="mid-1 pt-5 pb-5 text-center">
              <div className="mid-2 d-flex justify-content-center">
                <FontAwesomeIcon icon={faHouseChimney} className="bg-blue mb-3" />
              </div>
              <h4>Delivery all over Nepal</h4>
              <p>We deliver to your doorsteps</p>
            </div>
          </section>
        </div>
        <Products/>
      </>
    );
};

export default Shop;
