import {Button, Card, Col, ListGroup, Modal, Row} from "react-bootstrap";
import DishesFilter from "./DishesFilter.jsx";
import React, {useEffect, useRef, useState} from "react";
import debounce from "lodash/debounce.js";
import dishesService from "../services/dishes.js";
import CustomSpinner from "./CustomSpinner.jsx";;
import Pagination from "./Pagination.jsx";
import PieChartComponent from "./PieChartCustom.jsx";
import {useNotificationStore} from "../stores/index.js";

const AddDishesModal = ({show, handleClose, handleAddDish}) => {
  const [dishes, setDishes] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [servings, setServings] = useState(1);

  const [filters, setFilters] = useState({
    name: "",
    diet: "",
    allergies: [],
    minCalories: "",
    maxCalories: "",
    dishType: "",
    cuisine: "",
  });
  const [selectedDish, setSelectedDish] = useState(null);
  const { showNotification } = useNotificationStore();

  const isInitialRender = useRef(true);

  const previousFilters = useRef(filters);

  const debouncedfetchDishes = debounce(async () => {
    const result = await dishesService.getAll(
      filters.diet,
      filters.allergies,
      filters.name,
      filters.minCalories,
      filters.maxCalories,
      filters.dishType,
      filters.cuisine,
      currentPage,
      5
    );
    setDishes(result.dishes);
    setTotalPages(result.totalPages);
  }, 200);

  useEffect(() => {
    const hasFilterChanged = Object.keys(filters).some(
      key => filters[key] !== previousFilters.current[key]
    );

    if (!isInitialRender.current && hasFilterChanged) {
      setCurrentPage(1);
    }

    previousFilters.current = filters;

    if (isInitialRender.current) {
      isInitialRender.current = false;
    }
  }, [filters]);

  useEffect(() => {
    debouncedfetchDishes();
  }, [filters, currentPage]);
  if (!dishes) {
    if (show) {
      return <CustomSpinner/>;
    }
    else {
      return null;
    }
  }
  return (
    <Modal dialogClassName="custom-modal" show={show} onHide={handleClose}>

      <Modal.Header className={'m-0 p-0'}>
        <Button variant='white' onClick={handleClose} >
          <i className="bi bi-x-lg" style={{color: 'red'}}></i>
        </Button>
      </Modal.Header>
      <Modal.Body style={{maxHeight: "85vh", overflowY: "auto"}}>
        <Row>
          <Col md={12} lg={6} style={{overflowY: 'scroll'}}>
            <DishesFilter filters={filters} setFilters={setFilters} inModal={true}/>
            {dishes.length > 0 &&
              dishes.map((dish) => (
                <div key={dish.id}
                     className='d-flex align-items-center mb-2 px-2 px-1 border border-2 border-secondary rounded-2 pointer-event bg-info-subtle'
                     style={{cursor: 'pointer'}}
                     onClick={() => setSelectedDish(dish)}>
                  <div
                    style={{
                      flexShrink: 0,
                      width: "50px",
                      marginRight: "24px",
                    }}
                  >
                    <img
                      src={dish.imageUrl}
                      alt={dish.name}
                      className='rounded-2'
                      style={{
                        width: "65px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.src = "/api/placeholder/50/50";
                      }}
                    />
                  </div>
                  <div className={'p-1'}>
                    <div className='fw-bold'>{dish.name}</div>
                    <span className='text-muted small badge bg-warning'>{dish.dishType}</span>&nbsp;
                    <span className='text-muted small badge bg-primary-subtle'>{dish.cuisine}</span>
                  </div>
                </div>
              ))}
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
            />
          </Col>
          <Col md={11} lg={6} className={'bg-white'}>
            <div>
              {selectedDish ?
                <>
                  <Card>
                    <Card.Header className="bg-white border-bottom-0">
                      <h4 className="text-center">{selectedDish.name}</h4>
                    </Card.Header>
                    <div className="card-img-wrapper">
                      <Card.Img
                        variant="top"
                        src={selectedDish.imageUrl}
                        className="img-fluid"
                        alt={`${selectedDish.name}'s image`}
                        style={{
                          width: "100%",
                          height: "300px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <Card.Body>
                      <div className="d-flex justify-content-center mb-2">
                        <PieChartComponent
                          protein={selectedDish.protein}
                          fat={selectedDish.fat}
                          carb={selectedDish.carb}
                          size={300}
                        />
                      </div>
                      <ListGroup variant="flush">
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                          <strong>Total Calories:</strong>
                          <span>{selectedDish.calories} kcal</span>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                          <strong>Protein:</strong>
                          <span>{selectedDish.protein}g</span>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                          <strong>Fat:</strong>
                          <span>{selectedDish.fat}g</span>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                          <strong>Carbs:</strong>
                          <span>{selectedDish.carb}g</span>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                          <strong>Servings:</strong>
                          <input
                            type="number"
                            step={0.1}
                            min={0}
                            value={servings}
                            onChange={(e) => setServings(parseFloat(e.target.value))}
                            style={{ width: "100px" }}
                          />
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                          <Button
                            variant="primary"
                            onClick={() => {
                              handleAddDish({dish: selectedDish,servings});
                              showNotification(
                                "Success",
                                "Add dish to meal plan successfully",
                                "success"
                              );
                            }}
                          >
                            Add to Meal Plan
                          </Button>
                        </ListGroup.Item>
                      </ListGroup>
                    </Card.Body>
                  </Card>

                </>
                :
                <h4>Please select a dish from the lists</h4>}
            </div>
          </Col>
        </Row>

      </Modal.Body>
    </Modal>
  );
};
export default AddDishesModal;