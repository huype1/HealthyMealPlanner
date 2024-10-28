import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserInfoForm from '../components/userInfo';
import { Container, Alert } from 'react-bootstrap';
import { useAuthStore, useNotificationStore } from '../stores';
import usersService from "../services/users";
const ProfileCompletion = () => {
  const { user } = useAuthStore();
  const { showNotification } = useNotificationStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.infoCompleted) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (data) => {
    try {
      const updatedUser = await usersService.update(user.userId, data);
      console.log(updatedUser)
      showNotification('Update profile successfully', `user updated`, 'success');
      localStorage.setItem('loggedUser', JSON.stringify({...user, infoCompleted: true}))
      navigate('/');
    } catch (error) {
      showNotification('Failed to update profile', 'Please try again', 'danger');
      console.error('Error updating user info:', error);
    }
  };

  return (
    <Container>
      <UserInfoForm user={user} onSubmit={handleSubmit} />
    </Container>
  );
};
export default ProfileCompletion