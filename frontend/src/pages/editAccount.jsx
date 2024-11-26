import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserInfoForm from "../components/userInfo";
import { Container, Alert } from "react-bootstrap";
import { useAuthStore, useNotificationStore } from "../stores";
import usersService from "../services/users";
const AccountEditPage = () => {
  const { user } = useAuthStore();
  const {showNotification} = useNotificationStore();
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    usersService
      .get(user.userId)
      .then((u) => setUserInfo(u))
      .catch((error) => console.log(error));
  }, [user, setUserInfo]);
  const handleSubmit = async (data) => {
    try {
      const updatedUser = await usersService.update(user.userId, {infoCompleted: true, ...data});
      console.log(updatedUser)
      showNotification('Update profile successfully', `user updated`, 'success');
    } catch (error) {
      showNotification('Failed to update profile', 'Please try again', 'danger');
      console.error('Error updating user info:', error);
    }
  };

  return (
    <Container>
      <UserInfoForm user={userInfo} onSubmit={handleSubmit} isEdit={true} />
    </Container>
  );
};
export default AccountEditPage;
