import { useState } from "react";
import { InputGroup, Button, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import usersService from "../services/users";
import loginService from "../services/login";
import Form from "react-bootstrap/Form";
import { useAuthStore, useNotificationStore } from "../stores";
import { useNavigate } from "react-router-dom";
import { setToken } from "../services/token";
const RegisterForm = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const { register, handleSubmit, getValues } = useForm();
  const [confirmPassword, setConfirmPassword] = useState("");
  const showNotification = useNotificationStore(
    (state) => state.showNotification
  );
  const validateRegistration = () => {
    const { passwordHash } = getValues();
    const termsChecked = document.querySelector(
      'input[type="checkbox"]'
    ).checked;

    if (passwordHash !== confirmPassword) {
      showNotification("Password do not match", "   ", "danger");
      return false;
    }

    if (!termsChecked) {
      showNotification(
        "Please accept our terms and conditions",
        "Error",
        "danger"
      );
      return false;
    }

    return true;
  };
  const handleRegister = async (data) => {
    if (validateRegistration()) {
      try {
        await usersService.create(data);
        const newUser = await loginService.login({
          userName: data.userName,
          password: data.passwordHash,
        });
        setUser(newUser);
        setToken(newUser.token);
        localStorage.setItem("loggedUser", JSON.stringify(newUser));
        showNotification(
          "create account succesfully",
          "redirect to homepage",
          "success"
        );
        navigate("/");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <Form
        className='container d-flex justify-content-center align-items-center vh-100  py-5'
        onSubmit={handleSubmit(handleRegister)}
      >
        <Row className='justify-content-center w-100'>
          <Col xs={12} md={8} lg={6}>
            <div className='d-flex fs-3 mb-3 gap-2'>
              <i className='bi bi-cup-hot-fill fs-2' />
              <h1 className=''>Register</h1>
            </div>

            <Form.Group className='mb-3'>
              <Form.Label className='fw-semibold'>Username: </Form.Label>
              <Form.Control
                type='text'
                {...register("userName", { required: "Username is required" })}
                className='custom-input'
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label className='fw-semibold'>Full name: </Form.Label>
              <Form.Control
                type='text'
                {...register("fullName", { required: "Name is required" })}
                className='custom-input'
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label className='fw-semibold'>Email: </Form.Label>
              <Form.Control
                type='email'
                {...register("email", { required: "Email is required" })}
                className='custom-input'
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label className='fw-semibold'>Password: </Form.Label>
              <InputGroup>
                <Form.Control
                  type={"password"}
                  className='custom-input'
                  {...register("passwordHash", {
                    required: "Password is required",
                  })}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label className='fw-semibold'>
                Confirm Password:{" "}
              </Form.Label>
              <InputGroup>
                <Form.Control
                  type={"password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className='custom-input'
                />
              </InputGroup>
            </Form.Group>
            <div className='mb-2'>
              Already have an account{" "}
              <a className='custom-link h4' href='/login'>
                Login
              </a>
            </div>

            <Form.Label className='fw-semibold mb-3 d-flex gap-2'>
              <Form.Check
                type='checkbox'
                className='border border-secondary rounded-2'
              />
              I agree with the{" "}
              <a href='https://www.eatthismuch.com/terms'>Terms of service </a>
            </Form.Label>

            <Button
              variant='primary'
              type='submit'
              className='btn btn-primary w-100 rounded-5'
            >
              <i className='bi bi-person'></i> Create account
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};
export default RegisterForm;
