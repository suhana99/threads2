import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faGift, faHouseChimney } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import '../styles/shop.css';
import { Col, Row } from 'reactstrap';
import { ProductList } from './ProductDetails';

const Shop = () => {
    return (
      <>
        <Row>
        <Col xs={12} lg={12} md={12}>
            <h1 className="text-center">Shop With Us</h1>
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
        <ProductList/>
      </>
    );
};

export default Shop;
