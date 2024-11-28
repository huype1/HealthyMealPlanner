import { useEffect, useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import savedDishesService from "../services/savedDishes";
import CustomSpinner from "../components/CustomSpinner";
import Pagination from "../components/Pagination";
import DishesFilter from "../components/DishesFilter";
import DishCard from "../components/DishCard";
import { useAuthStore } from "../stores";

const SavedDishesPage = () => {
  const [displayedDishes, setDisplayedDishes] = useState(null);
  const currUser = useAuthStore((state) => state.user);
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

  const fetchDishes = async (id) => {
    try {
      const result = await savedDishesService.getAll(
        filters.diet,
        filters.allergies,
        filters.name,
        filters.minCalories,
        filters.maxCalories,
        filters.dishType,
        filters.cuisine,
        currentPage,
        8
      );
      setDisplayedDishes(result.dishes);
      setTotalPages(result.totalPages)
    }
    catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    if (currUser?.userId) {
      fetchDishes(currUser.userId);
    }
  }, [currUser?.userId, filters, currentPage]);

  if (!displayedDishes) {
    return <CustomSpinner />;
  }

  return (
    <Container className='py-4'>
      <DishesFilter filters={filters} setFilters={setFilters} />
      {displayedDishes?.length === 0 ? (
        <div className='text-center py-5'>
          <h3>No dishes suit your preference</h3>
          <p className='text-muted'>Add more dish or adjust your filters</p>
        </div>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className='g-4 mb-4'>
          {displayedDishes?.map((dish) => (
            <Col key={dish.id}>
              <DishCard dish={dish} />
            </Col>
          ))}
        </Row>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </Container>
  );
};

export default SavedDishesPage;
