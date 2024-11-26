import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  ListGroup,
} from "react-bootstrap";
import usersService from "../services/users";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomSpinner from "../components/CustomSpinner";
import { formatDate } from "../services/toDate";
import ConfirmationModal from "../components/ConfirmDelete";
import { useAuthStore } from "../stores";
import logoutService from "../services/logout";
import NotFoundPage from "./notFound";
const UserPage = () => {
  const { id } = useParams();
  const { user, clearUser } = useAuthStore();
  const [userData, setUserData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await usersService.get(id);
        console.log(result);
        setUserData(result);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUserData();
  }, [id]);

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "locked":
        return "danger";
      default:
        return "warning";
    }
  };
  const handleConfirm = async () => {
    try {
      await usersService.remove(id);
      navigate("/");
      localStorage.removeItem("loggedUser");
      clearUser();
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (!userData) {
    return <CustomSpinner />;
  }
  if (userData.id !== user.userId && user.status !== "admin") {
    return <NotFoundPage />;
  }

  return (
    <Container fluid className='py-5'>
      <Row className='justify-content-center'>
        <Col xs={11} sm={11} md={10} lg={9}>
          <Card className=''>
            <Card.Header className='bg-white border-bottom-0 pt-4 pb-0'>
              <div className='d-flex justify-content-between align-items-start mb-3'>
                <div>
                  <div className='d-flex justify-content-start'>
                    <Button variant='white' onClick={() => navigate(-1)}>
                      <i className='bi bi-arrow-left h3'></i>
                    </Button>
                    <h3>{userData.fullName}</h3>
                  </div>
                </div>

                {user.userId === userData.id ? (
                  <div className='d-flex gap-2 flex-column flex-md-row'>
                    <Button variant='primary' href='/account/edit'>
                      <i className='bi bi-pencil-square'></i> Edit Account
                    </Button>
                    <Button variant='danger' onClick={() => setShowModal(true)}>
                      <i className='bi bi-trash3-fill'></i> Delete Account
                    </Button>
                  </div>
                ) : null}
              </div>
            </Card.Header>
            <Card.Body>
              <ListGroup variant='flush' className='mb-4'>
                <ListGroup.Item className='px-0'>
                  <strong>Status: </strong>{" "}
                  <Badge bg={getStatusVariant(userData.status)}>
                    {userData.status}
                  </Badge>
                </ListGroup.Item>
                <ListGroup.Item className='px-0 py-2'>
                  <strong>Username:</strong> {userData.userName}
                </ListGroup.Item>
                <ListGroup.Item className='px-0 py-2'>
                  <strong>Email:</strong> {userData.email}
                </ListGroup.Item>
                <ListGroup.Item className='px-0 py-2'>
                  <strong>Created At:</strong> {formatDate(userData.createdAt)}
                </ListGroup.Item>
              </ListGroup>
              <div className='w-75 mb-4'>
                <Button
                  variant='primary'
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? "Hide Details" : "Show Details"}
                </Button>
              </div>

              {showDetails && (
                <div className='border-top pt-3'>
                  <Row>
                    <Col md={6}>
                      <ListGroup variant='flush'>
                        <ListGroup.Item className='px-0 py-2'>
                          <strong>Weight:</strong> {userData.weight} kg
                        </ListGroup.Item>
                        <ListGroup.Item className='px-0 py-2'>
                          <strong>Height:</strong> {userData.height} cm
                        </ListGroup.Item>
                        <ListGroup.Item className='px-0 py-2'>
                          <strong>Age:</strong> {userData.age}
                        </ListGroup.Item>
                      </ListGroup>
                    </Col>
                    <Col md={6}>
                      <ListGroup variant='flush'>
                        <ListGroup.Item className='px-0 py-2'>
                          <strong>Activity Level:</strong>{" "}
                          {userData.activityLevel}
                        </ListGroup.Item>
                        <ListGroup.Item className='px-0 py-2'>
                          <strong>Weight Goal:</strong> {userData.weightGoal}
                        </ListGroup.Item>
                        <ListGroup.Item className='px-0 py-2'>
                          <strong>Diet:</strong> {userData.diet}
                        </ListGroup.Item>
                      </ListGroup>
                    </Col>
                  </Row>

                  <div className='mt-4'>
                    <Card.Subtitle className='mb-3'>
                      Target Calories
                    </Card.Subtitle>
                    <h3 className='text-primary mb-4'>
                      {userData.targetCalories} kcal/day
                    </h3>

                    <Card.Subtitle className='mb-3'>Allergies</Card.Subtitle>
                    {userData.UserAllergies?.length > 0 ? (
                      <div className='d-flex flex-wrap gap-2'>
                        {userData.UserAllergies.map((allergy, index) => (
                          <Badge key={index} bg='danger' className='py-2 px-3'>
                            {allergy.allergy}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className='text-muted'>No allergies</p>
                    )}
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <ConfirmationModal
        show={showModal}
        onConfirm={handleConfirm}
        onCancel={() => setShowModal(false)}
        title='Confirm delete account'
        message='Are you sure you want to perform this action?'
      />
    </Container>
  );
};

export default UserPage;
