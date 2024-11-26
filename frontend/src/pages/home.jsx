import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import dishesService from "../services/dishes";
const HomePage = () => {
  const navigate = useNavigate();

  // const [dishes, setDishes] = useState(null)
  // useEffect(() => {
  //   dishesServices.getAll()
  // })

  return (
    <div className='landing-page'>
      <div className='hero-section bg-primary text-white py-5'>
        <Container>
          <Row className='align-items-center py-5'>
            <Col lg={6} className='mb-4 mb-lg-0'>
              <h1 className='display-4 fw-bold mb-4'>Healthy Meal Planner</h1>
              <p className='lead mb-4'>
                Our product help you achieve better health as well as eating
                good
              </p>
              <Button
                variant='light'
                size='lg'
                className='fw-bold'
                onClick={() => navigate("/dishes")}
              >
                Discover
              </Button>
            </Col>
            {/* <Col lg={6}>
              <img
                src=''
                className='img-fluid rounded shadow-lg'
              />
            </Col> */}
          </Row>
        </Container>
      </div>

      <Container className='py-5'>
        <Row className='text-center g-4'>
          <Col md={4}>
            <div className='p-3'>
              <h3>Personalized Plans</h3>
              <p>
                Custom meal plans suggested by us to help you reach your goals
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className='p-3'>
              <h3>Learn more recipes from others</h3>
              <p>Access to many recipes uploaded by our users</p>
            </div>
          </Col>
          <Col md={4}>
            <div className='p-3'>
              <h3>Customise everything</h3>
              <p>Change everything you wanted to</p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Newest Dishes Carousel */}
    {/* <div className='bg-light py-5'>
        <Container>
          <h2 className='text-center mb-4'>Latest Healthy Recipes</h2>
          <Carousel className='dish-carousel mb-5'>
            {newestDishes.map((dish) => (
              <Carousel.Item key={dish.id}>
                <img
                  className='d-block w-100'
                  src={dish.image}
                  alt={dish.title}
                />
                <Carousel.Caption className='bg-dark bg-opacity-50 rounded p-3'>
                  <h3>{dish.title}</h3>
                  <p>{dish.description}</p>
                  <div className='d-flex justify-content-center gap-3'>
                    <span className='badge bg-primary'>{dish.category}</span>
                    <span className='badge bg-info'>
                      {dish.calories} calories
                    </span>
                  </div>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </Container>
      </div> */}

      <Container className='py-5'>
        <Row className='align-items-center'>
          <Col md={6} className='mb-4 mb-md-0'>
            <img
              src='https://img.freepik.com/free-vector/fast-food-isometric-set_1284-21631.jpg'
              alt='About us'
              className='img-fluid rounded'
            />
          </Col>
          <Col md={6}>
            <h2 className='mb-4'>About Healthy Meal Planner</h2>
            <p className='lead'>
              We believe that eating healthy should be easy and enjoyable. With many years of experience we hope to provide you with the best resources possible for free
            </p>
            <ul className='list-unstyled'>
              <li className='mb-2'>✓ Hundreds of famous recipes</li>
              <li className='mb-2'>✓ Informative nutrients</li>
              <li className='mb-2'>✓ Customise your meal plan</li>
              <li className='mb-2'>✓ Find new suggestions</li>
            </ul>
          </Col>
        </Row>
      </Container>

      <div className='bg-primary text-white text-center py-5'>
        <Container>
          <h2 className='display-5 mb-4'>Join us for a healthier lifestyle</h2>
          <p className='lead mb-4'></p>
          <Button
            variant='light'
            size='lg'
            className='fw-bold px-5'
            onClick={() => navigate("/register")}
          >
            Register Now
          </Button>
        </Container>
      </div>
    </div>
  );
};

export default HomePage;
