import React, {useEffect, useState} from 'react';
import {Button, Container, Card, Image, Alert, Dropdown} from 'react-bootstrap';
import { useNotificationStore} from "../stores/index.js";
import recipeService from "../services/recipes";
import RecipeForm from "./RecipeForm.jsx";
import CustomSpinner from "./CustomSpinner.jsx";

const RecipeStepsManager = ({dishId, isAuthor}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const [steps, setSteps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const showNotification = useNotificationStore((state) => state.showNotification);


  const fetchSteps = async () => {
    try {
      setIsLoading(true);
      const response = await recipeService.get(dishId);
      setSteps(response);
    } catch (error) {
      console.error('Error fetching steps:', error);
      showNotification('Error', 'Failed to load recipe steps. Please try again later.', 'danger');
    } finally {
      setIsLoading(false);
    }
  };
  const handleDelete = async (stepId) => {
    try {
      await recipeService.remove(stepId);
      showNotification('Success', 'Step deleted successfully.', 'success');
      await fetchSteps();
      setShowForm(false);
      setEditingStep(null);
    } catch (error) {
      console.error('Error submitting step:', error);
      showNotification('Error', 'Failed to delete step. Please try again', 'danger');
    }
  };
  useEffect(() => {
    if (dishId) {
      fetchSteps();
    }
  }, [dishId]);
  const handleSubmit = async (data, stepId = null) => {
    try {
      const submitData = {dishId: dishId, ...data}
      if (stepId) {
        await recipeService.update(submitData, stepId);
      } else {
        await recipeService.create(submitData);
      }
      await fetchSteps();
      setShowForm(false);
      setEditingStep(null);
    } catch (error) {
      console.error('Error submitting step:', error);
      showNotification('Error', 'Failed to save step. Please try again.', 'danger');
    }
  };

  const handleEdit = (step) => {
    setEditingStep(step);
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center p-5">
         <CustomSpinner/>
      </Container>
    );
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Recipe</h2>
        {isAuthor ? <Button
          variant="primary"
          onClick={() => {
            setEditingStep(null);
            setShowForm(!showForm);
          }}
        >
          {showForm ? 'Cancel' : 'Add New Step'}
        </Button> : null}

      </div>

      {showForm && isAuthor && (
        <RecipeForm
          existingStep={editingStep}
          currentStepsLength={steps.length}
          onSubmit={handleSubmit}
        />
      )}

      {steps.length === 0 ? (
        <Alert variant="info">
          There are no instructions for this dish yet.
        </Alert>
      ) : (
        <div className="mt-4">
          {steps.map((step) => (
            <Card key={step.id} className="mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className={'fw-bolder'}>Step {step.step}</div>
                    {step.content?.split('\n').map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                    {step.imageUrl && (
                      <Image
                        src={step.imageUrl}
                        alt={`Step ${step.step}`}
                        style={{width: 'fit-content'}}
                        thumbnail
                      />
                    )}
                  </div>
                  {isAuthor ?
                    <Dropdown align="end">
                      <Dropdown.Toggle
                        as="button"
                        variant="outline-primary"
                        size="sm"
                        className="d-flex align-items-center justify-content-center p-0 border-0 bg-transparent"
                        id={`dropdown-${step.id}`}
                      >
                        <i className="bi bi-three-dots-vertical"></i>
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleEdit(step)}>Edit</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDelete(step.id)}>Delete</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                     : null}
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
};

export default RecipeStepsManager;