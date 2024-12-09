import {Card} from "react-bootstrap";
import {Link} from "react-router-dom";
import Rating from "react-rating";
import React from "react";

const DishCard = ({dish}) => {
  return (
    <Link
      to={`/dish/${dish.id}`}
      className="text-decoration-none"
    >
      <Card
        className="h-100 transition-all duration-300 hover:-translate-y-2"
        style={{
          transform: 'scale(1)',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div style={{height: "200px", overflow: "hidden"}}>
          <Card.Img
            variant="top"
            src={dish.imageUrl || "/placeholder-dish.jpg"}
            alt={dish.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
        <Card.Body className="d-flex flex-column">
          <Card.Title className="mb-3 fw-bold">{dish.name}</Card.Title>
          {dish.ratings && dish.ratings !== 0 ?
            <Rating
              emptySymbol={<i className="bi bi-star" style={{color: "gold"}}></i>}
              fullSymbol={<i className="bi bi-star-fill" style={{color: "gold"}}></i>}
              initialRating={dish.averageRating}
              readonly
            />
            : null
          }

          <div className="d-flex gap-2 mb-2">
            {dish.diet && (
              <span className="badge bg-dark">{dish.diet}</span>
            )}
            {dish.cuisine && (
              <span className="badge bg-secondary">{dish.cuisine}</span>
            )}
          </div>

          {dish.dishType && (
            <div className="mb-2">
              <span className="badge bg-primary">{dish.dishType}</span>
            </div>
          )}

          <div className="mt-auto">
            <small className="text-muted">
              {dish.calories} calories
            </small>
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default DishCard;