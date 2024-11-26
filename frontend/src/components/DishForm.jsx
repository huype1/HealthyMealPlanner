import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {Container, Row, Col, Form, Button, Image} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import dishesService from "../services/dishes";
import {useAuthStore, useNotificationStore} from "../stores";
import {handleImageUpload} from "../services/supabaseClient.js";

const DishForm = () => {
  const navigate = useNavigate();
  const {id} = useParams();
  const {user} = useAuthStore();
  const isEditMode = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);
  const showNotification = useNotificationStore(
    (state) => state.showNotification
  );

  const {register, handleSubmit, setValue, getValues, watch} = useForm({
    defaultValues: {
      name: "",
      imageUrl: "",
      imageFile: null,
      recipeUrl: "",
      calories: "",
      protein: "",
      fat: "",
      carb: "",
      diet: "",
      cuisine: "",
      dishType: "",
      allergies: [],
    },
  });

  const imageUrl = watch("imageUrl");
  const imageFile = watch("imageFile"); // Watch for the selected image file

  const dietOptions = [
    "vegan",
    "vegetarian",
    "keto",
    "high-protein",
    "low-fat",
    "low-carb",
    "balanced",
    "high-fiber",
  ];

  const cuisineOptions = [
    "vietnamese",
    "korean",
    "japanese",
    "italian",
    "american",
    "mexican",
    "indian",
    "chinese",
    "thai",
    "others",
  ];

  const dishTypeOptions = ["main", "snack"];

  useEffect(() => {
    const fetchDish = async () => {
      if (!isEditMode || !user?.userId) return;

      try {
        const dish = await dishesService.get(id);

        if (parseInt(dish.user.id) !== parseInt(user.userId)) {
          showNotification(
            "You're not allowed to edit this dish",
            "redirect to dishes",
            "danger"
          );
          navigate("/dishes", {replace: true});
          return;
        }

        Object.keys(dish).forEach((key) => {
          setValue(key, dish[key] || "");
        });

        if (dish.DishAllergies?.length) {
          setValue("allergies", dish.DishAllergies.map((da) => da.allergy));
        }
      } catch (error) {
        console.log(error)
        showNotification("Cannot load dish", "redirect to dishes", "danger");
        navigate("/dishes", {replace: true});
      }
    };

    fetchDish();
  }, [id, isEditMode, setValue, navigate, user?.userId, showNotification]);

  const handleAllergyChange = (allergy, checked) => {
    const currentAllergies = getValues("allergies") || [];
    let newAllergies;

    if (checked) {
      newAllergies = [...currentAllergies, allergy];
    } else {
      newAllergies = currentAllergies.filter((a) => a !== allergy);
    }

    setValue("allergies", newAllergies);
  };




  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      let imageUrl = data.imageUrl;
      if (data.imageFile?.[0]) {
        imageUrl = await handleImageUpload(data.imageFile[0], user.userId);
      }

      const numericData = {
        ...data,
        imageUrl,
        calories: data.calories ? parseInt(data.calories) : null,
        protein: data.protein ? parseFloat(data.protein) : null,
        fat: data.fat ? parseFloat(data.fat) : null,
        carb: data.carb ? parseFloat(data.carb) : null,
        averageRating: data.averageRating ? parseFloat(data.averageRating) : 0,
        ratings: data.ratings ? parseInt(data.ratings) : 0,
        DishAllergies: data.allergies.map((allergy) => ({allergy})),
        userId: user.userId,
      };

      delete numericData.imageFile;
      delete numericData.allergies;

      if (isEditMode) {
        await dishesService.update(numericData);
      } else {
        await dishesService.create(numericData);
      }

      navigate("/dishes");
    } catch (error) {
      showNotification("Cannot save dish", "Please try again later", "danger");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Container className='py-4'>
      <div className='mb-4'>
        <h2 className='mb-1'>{isEditMode ? "Edit Dish" : "Create New Dish"}</h2>
        <p className='text-muted'>
          Fill in the details below to {isEditMode ? "update" : "create"} your
          dish
        </p>
      </div>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className='g-4'>
          <Col lg={4}>
            <div
              className="border rounded mb-3 d-flex align-items-center justify-content-center bg-light"
              style={{height: "300px", overflow: "hidden"}}
            >
              {imageFile?.[0] ? (
                <Image
                  src={URL.createObjectURL(imageFile[0])}
                  alt="Dish preview"
                  className="img-fluid"
                  style={{objectFit: "cover", width: "100%", height: "100%"}}
                />
              ) : imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="Dish preview"
                  className="img-fluid"
                  style={{objectFit: "cover", width: "100%", height: "100%"}}
                />
              ) : (
                <div className="text-center p-4">
                  <i className="bi bi-image h1"></i>
                  <p className="text-muted mb-0">No image</p>
                </div>
              )}
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                {...register("imageFile")}
              />
            </Form.Group>
          </Col>

          <Col lg={8}>
            <Row>
              <Col md={6}>
                <Form.Group className='mb-3'>
                  <Form.Label>Name *</Form.Label>
                  <Form.Control
                    type='text'
                    {...register("name", {required: true})}
                  />
                </Form.Group>

                <Form.Group className='mb-3'>
                  <Form.Label>Recipe URL</Form.Label>
                  <Form.Control
                    type='url'
                    {...register("recipeUrl")}
                    placeholder='https://example.com/recipe'
                  />
                </Form.Group>

                <Form.Group className='mb-3'>
                  <Form.Label>Calories</Form.Label>
                  <Form.Control
                    type='number'
                    {...register("calories")}
                    min='0'
                  />
                </Form.Group>

                <Row>
                  <Col sm={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Protein (g)</Form.Label>
                      <Form.Control
                        type='number'
                        step='0.1'
                        min='0'
                        {...register("protein")}
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Fat (g)</Form.Label>
                      <Form.Control
                        type='number'
                        step='0.1'
                        min='0'
                        {...register("fat")}
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={4}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Carbs (g)</Form.Label>
                      <Form.Control
                        type='number'
                        step='0.1'
                        min='0'
                        {...register("carb")}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>

              <Col md={6}>
                <Form.Group className='mb-3'>
                  <Form.Label>Diet *</Form.Label>
                  <Form.Select {...register("diet", {required: true})}>
                    <option value=''>Select Diet</option>
                    {dietOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className='mb-3'>
                  <Form.Label>Cuisine *</Form.Label>
                  <Form.Select {...register("cuisine", {required: true})}>
                    <option value=''>Select Cuisine</option>
                    {cuisineOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className='mb-3'>
                  <Form.Label>Dish Type *</Form.Label>
                  <Form.Select {...register("dishType", {required: true})}>
                    <option value=''>Select Dish Type</option>
                    {dishTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className='mb-3'>
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
                    <Form.Check
                      key={allergy}
                      type='checkbox'
                      id={allergy}
                      label={allergy.charAt(0).toUpperCase() + allergy.slice(1)}
                      checked={watch("allergies")?.includes(allergy)}
                      onChange={(e) =>
                        handleAllergyChange(allergy, e.target.checked)
                      }
                    />
                  ))}
                </Form.Group>
              </Col>
            </Row>
          </Col>
        </Row>

        <div className='d-flex gap-2 justify-content-end mt-4'>
          <Button
            variant='outline-secondary'
            onClick={() => navigate(-1)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type='submit' variant='primary' disabled={isLoading}>
            {isLoading
              ? "Saving..."
              : isEditMode
                ? "Update Dish"
                : "Create Dish"}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default DishForm;
