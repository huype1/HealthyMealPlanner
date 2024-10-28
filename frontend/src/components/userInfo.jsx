import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';

const UserInfoForm = ({ user, onSubmit, isEdit = false }) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      weight: user?.weight || '',
      height: user?.height || '',
      age: user?.age || '',
      activityLevel: user?.activityLevel || '',
      weightGoal: user?.weightGoal || '',
      diet: user?.diet || '',
      UserAllergies: user?.UserAllergies?.map(a => a.allergy) || []
    }
  });

  const allergies = [
    'gluten',
    'dairy',
    'nuts',
    'soy',
    'eggs',
    'fish',
    'shellfish'
  ];

  useEffect(() => {
    if (user) {
      reset({
        weight: user.weight || '',
        height: user.height || '',
        age: user.age || '',
        activityLevel: user.activityLevel || '',
        weightGoal: user.weightGoal || '',
        diet: user.diet || '',
        UserAllergies: user.UserAllergies?.map(a => a.allergy) || []
      });
    }
  }, [user, reset]);

  const handleSubmitForm = (data) => {
    const formattedData = {
      ...data,
      UserAllergies: data.UserAllergies.map(allergy => ({
        allergy
      }))
    };
    onSubmit(formattedData);
  };

  return (
    <Container className="py-4">
      <h2>{isEdit ? 'Edit Profile' : 'Complete Your Profile'}</h2>
      
      {!isEdit && !user?.infoCompleted && (
        <Alert variant="info" className="mb-4">
          Please complete your profile information to continue
        </Alert>
      )}

      <Form onSubmit={handleSubmit(handleSubmitForm)}>
        <Row className="g-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Weight (kg)</Form.Label>
              <Form.Control
                type="number"
                isInvalid={!!errors.weight}
                placeholder="Enter your weight"
                {...register('weight', { 
                  required: 'Weight is required',
                  min: { value: 30, message: 'Weight must be at least 30kg' },
                  max: { value: 300, message: 'Weight must be less than 300kg' }
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.weight?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Height (cm)</Form.Label>
              <Form.Control
                type="number"
                isInvalid={!!errors.height}
                placeholder="Enter your height"
                {...register('height', { 
                  required: 'Height is required',
                  min: { value: 100, message: 'Height must be at least 100cm' },
                  max: { value: 250, message: 'Height must be less than 250cm' }
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.height?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                isInvalid={!!errors.age}
                placeholder="Enter your age"
                {...register('age', { 
                  required: 'Age is required',
                  min: { value: 10, message: 'Age must be at least 10' },
                  max: { value: 120, message: 'Age must be less than 120' }
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.age?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Activity Level</Form.Label>
              <Form.Select
                isInvalid={!!errors.activityLevel}
                {...register('activityLevel', { required: 'Activity level is required' })}
              >
                <option value="">Select activity level</option>
                <option value="sedentary">Sedentary (little or no exercise)</option>
                <option value="light">Light Active (exercise 1-3 times/week)</option>
                <option value="moderate">Moderate Active (exercise 3-5 times/week)</option>
                <option value="very">Very Active (exercise 6-7 times/week)</option>
                <option value="extra">Extra Active (very intense exercise daily)</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.activityLevel?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Weight Goal</Form.Label>
              <Form.Select
                isInvalid={!!errors.weightGoal}
                {...register('weightGoal', { required: 'Weight goal is required' })}
              >
                <option value="">Select weight goal</option>
                <option value="lose">Lose Weight</option>
                <option value="maintain">Maintain Weight</option>
                <option value="gain">Gain Weight</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.weightGoal?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Diet Preference</Form.Label>
              <Form.Select
                isInvalid={!!errors.diet}
                {...register('diet', { required: 'Diet preference is required' })}
              >
                <option value="">Select diet preference</option>
                <option value="none">No Specific Diet</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="keto">Keto</option>
                <option value="paleo">Paleo</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.diet?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group>
              <Form.Label>Allergies</Form.Label>
              <div className="border rounded p-3">
                {allergies.map((allergy) => (
                  <Form.Check
                    key={allergy}
                    type="checkbox"
                    id={`allergy-${allergy}`}
                    label={allergy.charAt(0).toUpperCase() + allergy.slice(1)}
                    value={allergy}
                    {...register('UserAllergies')}
                  />
                ))}
              </div>
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-end mt-4">
          <Button type="submit" variant="primary">
            {isEdit ? 'Save Changes' : 'Complete Profile'}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default UserInfoForm;