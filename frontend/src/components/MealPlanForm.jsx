import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import { useNotificationStore} from "../stores/index.js";
import {useForm} from "react-hook-form";
import {Badge, Button, Card, Col, Form, ListGroup, Row} from "react-bootstrap";
import PieChartComponent from "./PieChartCustom.jsx";
import AddDishesModal from "./AddDishesModal.jsx";
import mealPlanService from "../services/mealPlans.js";
import axios from "axios";
import {getConfig} from "../services/token.js";
//helper function
const calculateMealPlanDetails = (dishes) => {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  const allergies = new Set();

  dishes.forEach((dish) => {
    totalCalories += dish.dish.calories * dish.servings || 0;
    totalProtein += dish.dish.protein * dish.servings || 0;
    totalCarbs += dish.dish.carb * dish.servings || 0;
    totalFat += dish.dish.fat * dish.servings || 0;
    dish.dish.DishAllergies?.forEach((allergy) => allergies.add(allergy.allergy));
  });

  return {
    totalCalories, totalProtein, totalCarbs, totalFat, allergies: [...allergies],
  };
};

const MealPlanForm = () => {
  const navigate = useNavigate()
  const {id} = useParams();
  const [showAddDishesModal, setShowAddDishesModal] = useState(false);
  const showNotification = useNotificationStore((state) => state.showNotification);
  const {register, handleSubmit, setValue, getValues, watch} = useForm({
    defaultValues: {
      name: "",
      totalCalories: 0,
      totalProtein: 0,
      totalFat: 0,
      totalCarbs: 0,
      diet: "",
      allergies: [],
      description: "",
      dishes: [],
    },
  });
  const totalCalories = watch('totalCalories')
  const totalCarbs = watch('totalCarbs')
  const totalFat = watch('totalFat')
  const totalProtein = watch('totalProtein')
  const dishes = watch("dishes");
  const allergies = watch("allergies")

  const updateMealPlanDetails = (dishes) => {
    const updatedDetails = calculateMealPlanDetails(dishes);
    setValue("totalCalories", updatedDetails.totalCalories);
    setValue("totalProtein", updatedDetails.totalProtein);
    setValue("totalCarbs", updatedDetails.totalCarbs);
    setValue("totalFat", updatedDetails.totalFat);
    setValue("allergies", updatedDetails.allergies);
  };
  const handleAddDish = ({dish, servings}) => {
    const currentDishes = getValues("dishes");
    const existingDishIndex = currentDishes.findIndex((d) => d.dish.id === dish.id);

    if (existingDishIndex !== -1) {
      currentDishes[existingDishIndex].servings += servings;
    } else {
      currentDishes.push({dish, servings});
    }
    setValue("dishes", [...currentDishes]);
    updateMealPlanDetails(currentDishes);
  };

  const handleChangeServings = (dishId, newServings) => {
    const currentDishes = getValues("dishes");
    const updatedDishes = currentDishes.map((d) =>
      d.dish.id === dishId ? {...d, servings: newServings} : d
    );


    setValue("dishes", [...updatedDishes]);
    updateMealPlanDetails(updatedDishes);
  };

  const handleDeleteDish = (dishId) => {
    const currentDishes = getValues("dishes");
    const updatedDishes = currentDishes.filter((d) => d.dish.id !== dishId);

    setValue("dishes", [...updatedDishes]);
    updateMealPlanDetails(updatedDishes);
  };
  const handleSuggestion = async () => {
    const suggestedDishes = await axios.get("http://localhost:3001/api/suggest", getConfig());
    setValue("dishes", suggestedDishes.data)
    updateMealPlanDetails(suggestedDishes.data)
  }

  const dietOptions = ["vegan", "vegetarian", "keto", "high-protein", "low-fat", "low-carb", "balanced", "high-fiber"];
  const onSubmit = async (data) => {
    try {
      if (id) {
        await mealPlanService.update({...data, id: id, isCalculated: true})
      }
      else {
        await mealPlanService.create({...data, isCalculated: true})
      }
    showNotification('Success', "Meal Plan Saved", "success");
    navigate("/meal-plans");
  } catch (error) {
    showNotification("Cannot save dish", "Please try again later", "danger");
    console.log(error);
  }
  }
  useEffect(() => {
    const fetchDish = async () => {
      if (!id) return;

      try {
        const mealPlan = await mealPlanService.get(id);
        console.log(mealPlan);
        Object.keys(mealPlan).forEach((key) => {
          setValue(key, mealPlan[key] || "");
        });
        if (mealPlan.dishes?.length) {
          const dishesFormat = mealPlan.dishes.map((da) => {
            return {dish: da, servings: da.MealPlanDish.servings}} )
          setValue("dishes", dishesFormat);
          updateMealPlanDetails(dishesFormat);
        }
      } catch (error) {
        console.log(error)
        showNotification("Cannot load ", "redirect ", "danger");
        navigate("/meal-plans", {replace: true});
      }
    };

    fetchDish();
  }, [id, navigate]);

  return (<>
    <Form onSubmit={handleSubmit(onSubmit)}>

      <Row className='g-4 justify-content-center'>
        <Col lg={5} md={7} sm={12} xs={12}>
          <Form.Group className='mb-3'>
            <Form.Label>Name *</Form.Label>
            <Form.Control
              type='text' className='custom-input'
              {...register("name", {required: true})}
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Diet *</Form.Label>
            <Form.Select className='custom-input' {...register("diet", {required: true})}>
              <option value=''>Select Diet</option>
              {dietOptions.map((option) => (<option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>))}
            </Form.Select>
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3}
                          className='custom-input'
                          {...register("description", {required: false})}/>
          </Form.Group>
          <div className="flex d-flex mb-2 gap-1">
            <Button variant='primary' onClick={() => setShowAddDishesModal(true)}>Add dishes</Button>
            <Button variant='secondary' onClick={handleSuggestion}>Add suggested dish</Button>
          </div>

          <div>
            {dishes.map((detail) => (<div
              key={detail.dish.id}
              className="d-flex align-items-center mb-2 px-2 py-1 border border-2 border-secondary rounded-2 bg-info-subtle position-relative"
            >
              <div
                style={{
                  flexShrink: 0, width: "50px", marginRight: "24px",
                }}
              >
                <img
                  src={detail.dish.imageUrl}
                  alt={detail.dish.name}
                  style={{
                    width: "65px", height: "50px", objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.src = "/api/placeholder/50/50";
                  }}
                />
              </div>

              <div style={{flex: 1}}>
                <div className="fw-bold">{detail.dish.name}</div>
                <span className="text-muted small badge bg-warning">
                  {detail.dish.dishType}
                </span>
                &nbsp;
                <span className="text-muted small badge bg-primary-subtle">
                  {detail.dish.cuisine}
                </span>
                <div className="small">
                  <strong>Servings:</strong>{" "}
                  <input
                    type="number"
                    step={0.5}
                    min={0}
                    value={detail.servings}
                    onChange={(e) => {
                      const newServings = parseFloat(e.target.value);
                      if (newServings > 0) {
                        handleChangeServings(detail.dish.id, newServings)
                      }
                    }}
                    style={{width: "60px", margin: "2px"}}
                  />
                </div>
              </div>

              <div
                className="position-absolute top-0 end-0 p-2"
                style={{cursor: "pointer"}}
                onClick={() => handleDeleteDish(detail.dish.id)}
              >
                <i className="bi bi-trash text-danger"></i>
              </div>
            </div>))}
          </div>

        </Col>

        {totalCalories && totalCarbs && totalProtein && totalFat ? <Col lg={6} md={5} sm={12} xs={12}>
          <Card>
            <Card.Body>
              <div className='d-flex justify-content-center mb-2'>
                <PieChartComponent
                  protein={totalProtein}
                  fat={totalFat}
                  carb={totalCarbs}
                  size={350}
                />
              </div>
              <ListGroup variant='flush'>
                <ListGroup.Item className='d-flex justify-content-between align-items-center'>
                  <strong>Total Calories:</strong>
                  <span>{totalCalories} kcal</span>
                </ListGroup.Item>
                <ListGroup.Item className='d-flex justify-content-between align-items-center'>
                  <strong>Protein:</strong>
                  <span>{totalProtein}g</span>
                </ListGroup.Item>
                <ListGroup.Item className='d-flex justify-content-between align-items-center'>
                  <strong>Fat:</strong>
                  <span>{totalFat}g</span>
                </ListGroup.Item>
                <ListGroup.Item className='d-flex justify-content-between align-items-center'>
                  <strong>Carbs:</strong>
                  <span>{totalCarbs}g</span>
                </ListGroup.Item>
                <ListGroup.Item>
                <strong>Include: </strong>
                {allergies?.map((allergy) => (
                  <Badge
                    key={allergy}
                    bg='danger'
                    className='me-1'
                  >
                    {allergy}
                  </Badge>
                ))}
              </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col> : null}

      </Row>
      <hr/>
      <Row>
        <Col xs={12} className={'flex align-items-center text-center align-content-center'}>
          <Button variant='primary' type='submit' style={{width: '20vw', fontSize: "larger", fontWeight: 'bold'}}>
            Save
          </Button>
          <AddDishesModal show={showAddDishesModal} handleAddDish={handleAddDish}
                          handleClose={() => setShowAddDishesModal(false)}/>
        </Col>
      </Row>
    </Form>
  </>)
}
export default MealPlanForm;