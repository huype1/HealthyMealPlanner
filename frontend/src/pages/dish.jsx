import React, {useEffect, useState} from "react";
import {PieChart, Pie, Tooltip, Cell} from "recharts";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  ListGroup,
  Badge,
} from "react-bootstrap";
import CustomSpinner from "../components/CustomSpinner";
import dishesService from "../services/dishes";
import {useNavigate, useParams} from "react-router-dom";
import PieChartComponent from "../components/PieChartCustom";
import {formatDate} from "../services/toDate";
import {useAuthStore, useNotificationStore} from "../stores";
import savedDishesService from "../services/savedDishes";
import ConfirmationModal from "../components/ConfirmDelete.jsx";
import RecipeStepsManager from "../components/RecipeStepsManager.jsx";
import Rating from "react-rating";
import CommentSection from "../components/CommentSection.jsx";

const DishInformation = () => {
  const {user} = useAuthStore();
  const showNotification = useNotificationStore(
    (state) => state.showNotification
  );
  const navigate = useNavigate();
  const [dish, setDish] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const {id} = useParams();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fetchDishInfo = () => {
    dishesService.get(id).then((result) => {
      setDish(result);
    });
  }
  useEffect(() => {
    fetchDishInfo();
    if (user.userId) {
      savedDishesService
        .isSaved(user.userId, id)
        .then((result) => setIsSaved(result))
        .catch((error) => console.log(error));
    }

  }, []);

  if (!dish) {
    return <CustomSpinner/>;
  }

  const handleDelete = async () => {
    try {
      await dishesService.remove(id);
      showNotification("Delete successfully", `Dish deleted`, "success");
      navigate("/");
    } catch (error) {
      showNotification(
        "Cannot delete dish",
        Object.values(error.response.data)[0],
        "danger"
      );
    }
  };

  const handleSave = async () => {
    try {
      if (isSaved) {
        await savedDishesService.remove(user.userId, id);
        showNotification("Success", "Dish removed from saved list", "success");
      } else {
        await savedDishesService.create({userId: user.userId, dishId: id});
        showNotification("Success", "Dish added to saved list", "success");
      }
      setIsSaved(!isSaved)
    } catch (error) {
      console.log(error)
    }
  };


  return (
    <Container className='py-4'>
      <Row className='mb-4'>
        <Col>
          <div className='d-flex justify-content-between align-items-center'>
            <div className='d-flex justify-content-start'>
              <Button variant='white' onClick={() => navigate(-1)}>
                <i className='bi bi-arrow-left h1'></i>
              </Button>
              <h1 className='mb-0'>{dish.name}</h1>
            </div>
            {user.userName === dish.user.userName ? (
              <div className='d-flex gap-2 flex-column flex-md-row'>
                <Button
                  variant='primary'
                  className='px-2'
                  onClick={() => navigate(`/dish/edit/${id}`)}
                >
                  <i className='bi bi-pencil-square'></i> Edit
                </Button>
                <Button
                  className='px-2'
                  variant='danger'
                  onClick={() => setShowDeleteModal(true)}
                >
                  <i className='bi bi-trash3-fill'></i> Delete
                </Button>
              </div>
            ) : null}
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={5} md={5} className='mb-4'>
          <Card>
            <div className='card-img-wrapper'>
              <Card.Img
                variant='top'
                src={dish.imageUrl}
                className='img-fluid'
                alt={`${dish.name}'s image`}
                style={{
                  width: "100%",
                  height: "300px",
                  objectFit: "cover",
                }}
              />
            </div>
            <Card.Body>
              <div className='d-flex justify-content-center mb-2'>
                <PieChartComponent
                  protein={dish.protein}
                  fat={dish.fat}
                  carb={dish.carb}
                  size={300}
                />
              </div>
              <ListGroup variant='flush'>
                <ListGroup.Item className='d-flex justify-content-between align-items-center'>
                  <strong>Total Calories:</strong>
                  <span>{dish.calories} kcal</span>
                </ListGroup.Item>
                <ListGroup.Item className='d-flex justify-content-between align-items-center'>
                  <strong>Protein:</strong>
                  <span>{dish.protein}g</span>
                </ListGroup.Item>
                <ListGroup.Item className='d-flex justify-content-between align-items-center'>
                  <strong>Fat:</strong>
                  <span>{dish.fat}g</span>
                </ListGroup.Item>
                <ListGroup.Item className='d-flex justify-content-between align-items-center'>
                  <strong>Carbs:</strong>
                  <span>{dish.carb}g</span>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={7} md={7}>

          <ListGroup variant='flush'>
            <ListGroup.Item>
              <strong>Uploaded by:</strong> {dish.user.userName}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Ratings: </strong>
              <Rating
                emptySymbol={<i className="bi bi-star" style={{color: "gold"}}></i>}
                fullSymbol={<i className="bi bi-star-fill" style={{color: "gold"}}></i>}
                initialRating={dish.averageRating}
                readonly
                /> ({dish.ratings})
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Meal Type:</strong> {dish.dishType}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Diet:</strong> {dish.diet}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Cuisine:</strong> {dish.cuisine}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Allergic Ingredients:</strong>
              {dish.DishAllergies && dish.DishAllergies.length > 0 ? (
                <ul className='list-unstyled mb-0 mt-1'>
                  {dish.DishAllergies.map((allergy, index) => (
                    <Badge
                      key={index}
                      bg='danger'
                      className='py-2 px-3 mx-1'
                    >
                      {allergy.allergy}
                    </Badge>
                  ))}
                </ul>
              ) : (
                <span className='ms-2'>No allergic ingredients</span>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Created at:</strong> {formatDate(dish.createdAt)}
            </ListGroup.Item>
            <ListGroup.Item>
              {user?.userName ? (
                <Button
                  variant='primary'
                  onClick={handleSave}
                >
                  {isSaved ? "Remove from saved" : "Save dish"}
                </Button>
              ) : null}
            </ListGroup.Item>
          </ListGroup>
          <RecipeStepsManager
            dishId={dish.id}
            isAuthor={user.userName === dish.user.userName}
          />
          <div><strong>Reference:</strong>
            <a
              className='ms-2 text-decoration-none'
              href={dish.recipeUrl}
            >
              View Recipe
            </a></div>
        </Col>
      </Row>
      <Row>
        <CommentSection dishId={dish.id} reloadDish={fetchDishInfo} />
      </Row>
      <ConfirmationModal
        show={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        title="Delete this dish"
        message="Are you sure you want to delete this dish? This action can not be undone"
        confirmText="Delete"
        onConfirm={handleDelete}
      />
    </Container>
  );
};

export default DishInformation;
