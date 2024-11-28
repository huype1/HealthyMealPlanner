import {useState, useEffect} from "react";
import {Container, Row, Col, Card, Badge, Button, Form} from "react-bootstrap";
import mealPlanService from "../services/mealPlans";
import debounce from "lodash/debounce";
import CustomSpinner from "../components/CustomSpinner";
import Pagination from "../components/Pagination";
import {useNavigate} from "react-router-dom";
import MealPlanDishes from "../components/MealPlanDishes.jsx";

const MealPlanList = () => {
  const navigate = useNavigate();
  const [mealPlans, setMealPlans] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    name: "",
    diet: "",
    allergies: [],
    minCalories: "",
    maxCalories: "",
    limit: 7,
  });

  const debouncedfetchPlans = debounce(async () => {
    const result = await mealPlanService.getAll(
      filters.diet,
      filters.name,
      filters.minCalories,
      filters.maxCalories,
      filters.limit,
      currentPage
    );
    console.log(result);
    setMealPlans(result.mealPlans);
    setTotalPages(result.totalPages);
  }, 200);

  useEffect(() => {
    debouncedfetchPlans();
  }, [currentPage, filters]);
  const handleChange = (e) => {
    const {name, value} = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleReset = () => {
    setFilters({
      name: "",
      diet: "",
      minCalories: "",
      maxCalories: "",
      description: "",
      limit: 7
    });
  };
  const setTried = async (id) => {
    await mealPlanService.update({haveTried: true, id})
    debouncedfetchPlans();
  }
  if (!mealPlans) {
    return <CustomSpinner/>;
  }

  return (
    <Container className='py-4'>
      <Form className='mb-4 w-75 mx-auto'>
        <Row className='mb-3'>
          <Col sm={8}>
            <Form.Group controlId='name'>
              <Form.Control
                className='custom-input mb-2'
                type='text'
                placeholder='Meal Plan name: '
                name='name'
                value={filters.name}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col sm={4}>
            <Button href='/meal-plan/create' variant='primary' className="me-2 mb-2 ">
              <i className="bi bi-plus-square"></i> Create Meal Plan
            </Button>
          </Col>
        </Row>
        <Row className='mb-3'>
          <Col sm={6} md={3}>
            <Form.Group controlId='minCalories'>
              <Form.Label>Min Calories</Form.Label>
              <Form.Control
                type='number'
                name='minCalories'
                value={filters.minCalories}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col sm={6} md={3}>
            <Form.Group controlId='maxCalories'>
              <Form.Label>Max Calories</Form.Label>
              <Form.Control
                type='number'
                name='maxCalories'
                value={filters.maxCalories}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col sm={6} md={3}>
            <Form.Group controlId='diet'>
              <Form.Label>Diet</Form.Label>
              <Form.Select
                name='diet'
                value={filters.diet}
                onChange={handleChange}
              >
                <option value=''>Select Diet</option>
                <option value='vegan'>Vegan</option>
                <option value='vegetarian'>Vegetarian</option>
                <option value='keto'>Keto</option>
                <option value='high-protein'>High-Protein</option>
                <option value='low-fat'>Low-Fat</option>
                <option value='low-carb'>Low-Carb</option>
                <option value='balanced'>Balanced</option>
                <option value='high-fiber'>High-Fiber</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col sm={6} md={3}>
            <Form.Group controlId='minCalories'>
              <Form.Label>View By</Form.Label>
              <Form.Select
                name='limit'
                value={filters.limit}
                onChange={handleChange}
              >
                <option value={7} defaultValue>Week</option>
                <option value={1}>Day</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row className='mb-3'>
          <Col>
            <Button variant='secondary' onClick={handleReset} className="mb-2 ">
              Reset All Filters
            </Button>
          </Col>
        </Row>
      </Form>
      {/*Display each dishes*/}
      {mealPlans.map((plan) => (
        <Card key={plan.id} className={`mb-4 shadow-sm border-2 border-dark ${plan.haveTried ? 'bg-secondary-subtle' : 'bg-white'}`}
              style={{cursor: 'pointer'}}>
          <Card.Body>
            <div >
              <div
                className='mb-2 d-flex justify-content-between align-items-center'>
                <h3 className='mb-0' onClick={() => navigate(`/meal-plan/${plan.id}`)}>{plan.name}</h3>
                <Button onClick={() => setTried(plan.id)} disabled={plan.haveTried} variant='white'>
                  {plan.haveTried ? <i className="bi bi-check-lg" style={{color: 'green'}}></i> :
                    <i className="bi bi-square"></i>}
                </Button>
              </div>
              <div onClick={() => navigate(`/meal-plan/${plan.id}`)}className='mb-2 d-flex align-items-center gap-2'>
                <span className='fw-bold'>{plan.totalCalories} Calories</span>
                <span className='badge bg-primary'>{plan.diet}</span>
              </div>
              <div className='mb-3 '>
                <div className='d-flex flex-wrap gap-1'>
                  Include:
                  {plan.allergies.map((allergy) => (
                    <Badge
                      key={allergy}
                      bg='danger'
                      className='me-1'
                    >
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <MealPlanDishes dishes={plan.dishes}/>
          </Card.Body>
        </Card>
      ))}

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </Container>
  );
};

export default MealPlanList;
