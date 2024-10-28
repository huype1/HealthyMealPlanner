import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserInfoForm from "../components/userInfo";
import { Container, Alert } from "react-bootstrap";
import { useAuthStore } from "../stores";
import usersService from "../services/users";
const AccountEditPage = () => {
  const { user } = useAuthStore();
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  useEffect(() => {
    usersService
      .get(user.userId)
      .then((u) => setUserInfo(u))
      .catch((error) => console.log(error));
  }, [user, setUserInfo]);
  const handleSubmit = async (data) => {
    try {
      // const updatedUser = await updateUserInfo(user.id, data);

      navigate("/");
    } catch (error) {
      setError("Failed to update profile. Please try again.");
      console.error("Error updating user info:", error);
    }
  };

  return (
    <Container>
      {error && (
        <Alert variant='danger' className='mt-3'>
          {error}
        </Alert>
      )}
      <UserInfoForm user={userInfo} onSubmit={handleSubmit} isEdit={true} />
    </Container>
  );
};
export default AccountEditPage;
