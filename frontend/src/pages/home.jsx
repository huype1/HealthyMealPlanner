import React from 'react';
import { Container, Row, Col, Button, Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  // Sample newest dishes data
  const newestDishes = [
    {
      id: 1,
      title: "Mediterranean Quinoa Bowl",
      description: "Fresh vegetables, quinoa, and grilled chicken with olive oil dressing",
      image: "/api/placeholder/800/400",
      calories: 450,
      category: "Lunch"
    },
    {
      id: 2,
      title: "Grilled Salmon with Asparagus",
      description: "Wild-caught salmon with roasted vegetables",
      image: "/api/placeholder/800/400",
      calories: 520,
      category: "Dinner"
    },
    {
      id: 3,
      title: "Berry Protein Smoothie Bowl",
      description: "Mixed berries, Greek yogurt, and granola",
      image: "/api/placeholder/800/400",
      calories: 380,
      category: "Breakfast"
    }
  ];

  return (
    <div className="landing-page">
      <div className="hero-section bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center py-5">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold mb-4">Healthy Meal Planner</h1>
              <p className="lead mb-4">Our product help you achieve better health as well as eating good
              </p>
              <Button 
                variant="light" 
                size="lg" 
                className="fw-bold"
                onClick={() => navigate('/register')}
              >
                Start Your Journey
              </Button>
            </Col>
            <Col lg={6}>
              <img 
                src="https://assets3.cbsnewsstatic.com/hub/i/r/2015/10/19/0c638a39-f55a-4bbe-911d-222a08ac6fa1/thumbnail/1200x630/01694fa5ed572fb55cd4a831ca41a831/istock000039803170medium.jpg?v=17b612a59ff4c1e4774d3d0d3ec005e8" 
                alt="Healthy meal preparation" 
                className="img-fluid rounded shadow-lg"
              />
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        <Row className="text-center g-4">
          <Col md={4}>
            <div className="p-3">
              <h3>Personalized Plans</h3>
              <p>Custom meal plans suggested by us to help you reach your goals</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="p-3">
              <h3>Learn more recipes from others</h3>
              <p>Access to many recipes uploaded by our users</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="p-3">
              <h3>Shopping Lists</h3>
              <p>Automated shopping lists based on your weekly meal plan</p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Newest Dishes Carousel */}
      <div className="bg-light py-5">
        <Container>
          <h2 className="text-center mb-4">Latest Healthy Recipes</h2>
          <Carousel className="dish-carousel mb-5">
            {newestDishes.map((dish) => (
              <Carousel.Item key={dish.id}>
                <img
                  className="d-block w-100"
                  src={dish.image}
                  alt={dish.title}
                />
                <Carousel.Caption className="bg-dark bg-opacity-50 rounded p-3">
                  <h3>{dish.title}</h3>
                  <p>{dish.description}</p>
                  <div className="d-flex justify-content-center gap-3">
                    <span className="badge bg-primary">{dish.category}</span>
                    <span className="badge bg-info">{dish.calories} calories</span>
                  </div>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </Container>
      </div>

      <Container className="py-5">
        <Row className="align-items-center">
          <Col md={6} className="mb-4 mb-md-0">
            <img 
              src="/api/placeholder/500/300" 
              alt="About us" 
              className="img-fluid rounded"
            />
          </Col>
          <Col md={6}>
            <h2 className="mb-4">About Healthy Meal Planner</h2>
            <p className="lead">
              We believe that healthy eating should be easy and enjoyable. Our platform 
              combines nutritional science with your personal preferences to create 
              the perfect meal plan for you.
            </p>
            <ul className="list-unstyled">
              <li className="mb-2">✓ Expert-crafted recipes</li>
              <li className="mb-2">✓ Nutritionist-approved meals</li>
              <li className="mb-2">✓ Flexible meal scheduling</li>
              <li className="mb-2">✓ Regular new recipe updates</li>
            </ul>
          </Col>
        </Row>
      </Container>

      {/* CTA Section */}
      <div className="bg-primary text-white text-center py-5">
        <Container>
          <h2 className="display-5 mb-4">Join us for a healthier lifestyle</h2>
          <p className="lead mb-4">
            
          </p>
          <Button 
            variant="light" 
            size="lg" 
            className="fw-bold px-5"
            onClick={() => navigate('/register')}
          >
            Register Now
          </Button>
        </Container>
      </div>

    </div>
  );
};

export default HomePage;