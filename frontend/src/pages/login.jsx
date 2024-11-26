import { InputGroup, Button, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Form from "react-bootstrap/Form";
import loginService from "../services/login";
import { useAuthStore, useNotificationStore } from "../stores";
import { setToken } from "../services/token";
import {useState} from "react";
const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  //state for notification and logged in user
  const [isLoading, setIsLoading] = useState(false);
  const showNotification = useNotificationStore(
    (state) => state.showNotification
  );
  const setUser = useAuthStore((state) => state.setUser);
  //onsubmit
  const handleLogin = async (data) => {
    setIsLoading(true);
    try {
      const user = await loginService.login(data);
      setUser(user);
      setToken(user.token);
      localStorage.setItem("loggedUser", JSON.stringify(user));
      showNotification("Login successfully", "redirect to homepage", "success");
    } catch (error) {
      console.log(error);
      showNotification(
        "Cannot log in",
        Object.values(error.response.data)[0],
        "danger"
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Form
        className='container d-flex justify-content-center align-items-center pt-5'
        onSubmit={handleSubmit(handleLogin)}
      >
        <Row className='justify-content-center w-100'>
          <Col xs={12} md={8} lg={6}>
            <h1 className='mb-3 fs-2'>
              <i className='bi bi-cup-hot-fill' /> Log in
            </h1>
            <Form.Group className='mb-3'>
              <Form.Label className='fw-semibold'>Username: </Form.Label>
              <Form.Control
                type='text'
                className='custom-input'
                {...register("userName", { required: "Username is required" })}
              />
              <p className='fs-6 text-danger'>
                {errors?.userName && errors.userName.message}
              </p>
            </Form.Group>
            <Form.Group className='mb-4'>
              <Form.Label className='fw-semibold'>Password: </Form.Label>
              <InputGroup>
                <Form.Control
                  type={"password"}
                  className='custom-input'
                  {...register("password", {
                    required: "password is required",
                    minLength: {
                      value: 6,
                      message: "Password need to be at least 6 characters",
                    },
                  })}
                />
              </InputGroup>
              <p className='fs-6 text-danger'>
                {errors?.password && errors.password.message}
              </p>
            </Form.Group>
            <div className='mb-2'>
             {"Don't have an account  "}
              <a className='custom-link h4' href='/register'>
                Register
              </a>
            </div>
            <Button
              variant='primary'
              type='submit'
              className='btn btn-primary w-100 rounded-5'
              disabled={isLoading}
            >
              <i className='bi bi-box-arrow-in-right'></i> {isLoading ? 'Checking credentials...':  'Log in'}
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};
export default LoginForm;
