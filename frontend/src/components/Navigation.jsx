import { Nav, Navbar, Container, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import logoutService from "../services/logout";
import { useAuthStore } from "../stores";
import { useEffect } from "react";

const Navigation = () => {
  const navigate = useNavigate(); // React hook to handle navigation

  const { user, clearUser } = useAuthStore();
  const handleLogout = async () => {
    try {
      await logoutService.logout();
      clearUser();
      // Remove currentUser from localStorage
      localStorage.removeItem("loggedUser");
      // Redirect the user to the login page
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <>
      <Navbar expand='md' bg='primary' data-bs-theme='dark' sticky='top'>
        <Container>
          <Navbar.Brand href='/'>
            <i className='bi bi-cup-hot-fill' /> Meal Planner
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='me-auto'>
              <Nav.Link href='/'>Home</Nav.Link>
              {user.userName ? (
                <NavDropdown
                  title='Meal Plan'
                  id='basic-nav-dropdown'
                  variant='primary'
                  data-bs-theme='light'
                >
                  <NavDropdown.Item href='/meal-plans'>
                    My Meal Plan
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href='/meal-plan/create'>
                    Create Meal Plan
                  </NavDropdown.Item>
                </NavDropdown>
              ) : null}

              <Nav.Link href='/dishes'>Dishes</Nav.Link>
              {user.userName ? (
                <Nav.Link href='/dishes/saved'>Collections</Nav.Link>
              ) : null}
              {user.status === "admin" ? (
                <Nav.Link href='/admin'>Admin</Nav.Link>
              ) : null}
            </Nav>
            {user.userName ? (
              <Nav>
                <Nav.Link href={`/user/${user.userId}`}>
                  {user.userName}
                </Nav.Link>
                <Nav.Link eventKey={2} onClick={handleLogout}>
                  Logout
                </Nav.Link>
              </Nav>
            ) : (
              <Nav>
                <Nav.Link href='/login'>Login</Nav.Link>
                <Nav.Link eventKey={2} href='/register'>
                  Register
                </Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};
export default Navigation;
