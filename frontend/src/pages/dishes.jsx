import { useEffect, useState } from "react";
import { Form, Row, Col, Button, Collapse } from "react-bootstrap";
import dishesService from "../services/dishes";
import CustomSpinner from "../components/CustomSpinner";
import Pagination from "../components/Pagination";
import DishesFilter from "../components/DishesFilter";
import DishCard from "../components/DishCard";

import debounce from "lodash/debounce";
const DishesPage = () => {
  const [dishes, setDishes] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    name: "",
    diet: "",
    allergies: [],
    minCalories: "",
    maxCalories: "",
    dishType: "",
    cuisine: "",
  });


  const debouncedfetchDishes = debounce(async () => {
    const result = await dishesService.getAll(
      filters.diet,
      filters.allergies,
      filters.name,
      filters.minCalories,
      filters.maxCalories,
      filters.dishType,
      filters.cuisine,
      currentPage
    );
    console.log(result);
    setDishes(result.dishes);
    setTotalPages(result.totalPages);
  }, 200);
  useEffect(() => {
    debouncedfetchDishes();
  }, [currentPage, filters]);

  if (!dishes) {
    return <CustomSpinner />;
  }

  return (
    <div className='container mt-4 '>
      <DishesFilter filters={filters} setFilters={setFilters} />
      {dishes?.length === 0 ? (
        <div className='text-center py-5'>
          <h3>No dishes match your filters</h3>
          <p className='text-muted'>Try adjusting your filter criteria</p>
        </div>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className='g-4 mb-4'>
          {dishes?.map((dish) => (
            <Col key={dish.id}>
              <DishCard dish={dish} />
            </Col>
          ))}
        </Row>
      )}

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default DishesPage;
