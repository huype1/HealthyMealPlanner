import {useAuthStore, useNotificationStore} from "../stores/index.js";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import mealPlanService from "../services/mealPlans.js";
import CustomSpinner from "../components/CustomSpinner.jsx";
import {Badge, Button, Card, Col, Container, ListGroup, Row} from "react-bootstrap";
import PieChartComponent from "../components/PieChartCustom.jsx";
import {formatDate} from "../services/toDate.js";
import ConfirmationModal from "../components/ConfirmDelete.jsx";
import MealPlanDishes from "../components/MealPlanDishes.jsx";

const MealPlan = () => {
  const {user} = useAuthStore();
  const showNotification = useNotificationStore(
    (state) => state.showNotification
  );
  const navigate = useNavigate();
  const [mealPlan, setMealPlan] = useState(null);
  const {id} = useParams();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  useEffect(() => {
    try {
      mealPlanService.get(id).then((result) => {
        console.log(result)
        setMealPlan(result);
      });
    } catch (err) {
      console.log(err);
      showNotification("Error", "Can't get detail Meal Plan.\nPlease try again", "danger")
    }

  }, []);

  if (!mealPlan) {
    return <CustomSpinner/>;
  }

  const handleDelete = async () => {
    try {
      await mealPlanService.remove(id);
      navigate("/meal-plans");
      showNotification("Delete successfully", `Meal Plan deleted`, "success");
    } catch (error) {
      showNotification(
        "Cannot delete Meal Plan",
        Object.values(error.response.data)[0],
        "danger"
      );
    }
  };


  return (
    <>
      <Container className='py-4'>
        <Row className='mb-4'>
          <Col>
            <div className='d-flex justify-content-between align-items-center'>
              <div className='d-flex justify-content-start'>
                <Button variant='white' onClick={() => navigate(-1)}>
                  <i className='bi bi-arrow-left h1'></i>
                </Button>
                <h1 className='mb-0'>{mealPlan.name}</h1>
              </div>
              <div className='d-flex gap-2 flex-column flex-md-row'>
                <Button
                  variant='primary'
                  className='px-2'
                  onClick={() => navigate(`/meal-plan/edit/${id}`)}
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
            </div>
          </Col>
        </Row>

        <Row>

          <Col md={8} sm={10}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <strong>Diet:</strong> {mealPlan.diet}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Description:</strong> {mealPlan.description}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Created at:</strong> {formatDate(mealPlan.createdAt)}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Include: </strong>
                {mealPlan.allergies.map((allergy) => (
                  <Badge
                    key={allergy}
                    bg='danger'
                    className='me-1'
                  >
                    {allergy}
                  </Badge>
                ))}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Dishes:</strong>
              </ListGroup.Item>
            </ListGroup>
            <Card>
              <Card.Body>
                <MealPlanDishes dishes={mealPlan.dishes}/>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} sm={10} className='mb-4'>
            <Card>
              <Card.Body>
                <div className='d-flex justify-content-center mb-2'>
                  <PieChartComponent
                    protein={mealPlan.totalProtein}
                    fat={mealPlan.totalFat}
                    carb={mealPlan.totalCarbs}
                    size={350}
                  />
                </div>
                <ListGroup variant='flush'>
                  <ListGroup.Item className='d-flex justify-content-between align-items-center'>
                    <strong>Total Calories:</strong>
                    <span>{mealPlan.totalCalories} kcal</span>
                  </ListGroup.Item>
                  <ListGroup.Item className='d-flex justify-content-between align-items-center'>
                    <strong>Protein:</strong>
                    <span>{mealPlan.totalProtein}g</span>
                  </ListGroup.Item>
                  <ListGroup.Item className='d-flex justify-content-between align-items-center'>
                    <strong>Fat:</strong>
                    <span>{mealPlan.totalFat}g</span>
                  </ListGroup.Item>
                  <ListGroup.Item className='d-flex justify-content-between align-items-center'>
                    <strong>Carbs:</strong>
                    <span>{mealPlan.totalCarbs}g</span>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

        </Row>
        <ConfirmationModal
          show={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          title="Delete this Meal Plan"
          message="Are you sure you want to delete this Meal Plan? This action can not be undone"
          confirmText="Delete"
          onConfirm={handleDelete}
        />
      </Container>
    </>
  )
}
export default MealPlan;