import { useState } from "react";
import { Form, Row, Col, Button, Collapse } from "react-bootstrap";

const DishesFilter = ({ filters, setFilters }) => {
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAllergyChange = (allergy) => {
    setFilters((prev) => {
      const currentAllergies = prev.allergies || [];
      const newAllergies = currentAllergies.includes(allergy)
        ? currentAllergies.filter((a) => a !== allergy)
        : [...currentAllergies, allergy];

      return {
        ...prev,
        allergies: newAllergies,
      };
    });
  };

  const handleReset = () => {
    setFilters({
      name: "",
      diet: "",
      allergies: [],
      minCalories: "",
      maxCalories: "",
      dishType: "",
      cuisine: "",
    });
  };
  return (
    <Form className='mb-4 w-75 mx-auto'>
      <Row className='mb-3'>
        <Col sm={8}>
          <Form.Group controlId='name'>
            <Form.Control
              className='custom-input mb-2'
              type='text'
              placeholder='Dishes name: '
              name='name'
              value={filters.name}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col sm={4}>
          <Button
            variant='primary'
            className='w-100'
            onClick={() => setOpen(!open)}
            aria-controls='filter-collapse'
            aria-expanded={open}
          >
            {open ? (
              <i className='bi bi-x-square'> Hide</i>
            ) : (
              <i className='bi bi-arrow-down-square'> Filter</i>
            )}
          </Button>
        </Col>

        <Row className='my-2'>
          <Col sm={12}>
            <Button href='/dish/create' variant='primary' className="me-2 mb-2 ">
              <i className="bi bi-plus-square"></i> Create New Dish
            </Button>
            <Button variant='secondary' onClick={handleReset} className="mb-2 ">
              Reset All Filters
            </Button>
          </Col>
        </Row>
      </Row>

      <Collapse in={open}>
        <div id='filter-collapse'>
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
              <Form.Group controlId='dishType'>
                <Form.Label>Meal Type</Form.Label>
                <Form.Select
                  name='dishType'
                  value={filters.dishType}
                  onChange={handleChange}
                >
                  <option value=''>Select Meal Type</option>
                  <option value='main'>Main</option>
                  <option value='snack'>Snack</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col sm={6} md={4}>
              <Form.Group controlId='cuisine'>
                <Form.Label>Cuisine</Form.Label>
                <Form.Select
                  name='cuisine'
                  value={filters.cuisine}
                  onChange={handleChange}
                >
                  <option value=''>Select Cuisine</option>
                  <option value='vietnamese'>Vietnamese</option>
                  <option value='korean'>Korean</option>
                  <option value='japanese'>Japanese</option>
                  <option value='italian'>Italian</option>
                  <option value='american'>American</option>
                  <option value='mexican'>Mexican</option>
                  <option value='indian'>Indian</option>
                  <option value='chinese'>Chinese</option>
                  <option value='thai'>Thai</option>
                  <option value='others'>Others</option>
                </Form.Select>
              </Form.Group>
            </Col>
            {/* <Col sm={6} md={4}>
              <Form.Check type='switch' label='My own dishes' 
            </Col> */}
          </Row>

          <Row className='mb-3'>
            <Form.Label>Exclude</Form.Label>
            {[
              "gluten",
              "dairy",
              "nuts",
              "soy",
              "eggs",
              "fish",
              "shellfish",
            ].map((allergy) => (
              <Col sm={6} md={3} key={allergy}>
                <Form.Check
                  type='checkbox'
                  id={allergy}
                  label={allergy.charAt(0).toUpperCase() + allergy.slice(1)}
                  checked={filters.allergies.includes(allergy)}
                  onChange={() => handleAllergyChange(allergy)}
                />
              </Col>
            ))}
          </Row>
        </div>
      </Collapse>
    </Form>
  );
};

export default DishesFilter;
