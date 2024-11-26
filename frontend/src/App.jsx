import {useEffect, useState} from "react";
import {Routes, Route, Navigate, useNavigate} from "react-router-dom";
import LoginForm from "./pages/login";
import Notification from "./components/Notification";
import RegisterForm from "./pages/register";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import {useAuthStore} from "./stores";
import AdminPage from "./pages/admin";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/home";
import DishesPage from "./pages/dishes";
import SavedDishesPage from "./pages/savedDish";
import UserPage from "./pages/account";
import {setToken} from "./services/token";
import DishInformation from "./pages/dish";
import DishForm from "./components/DishForm";
import NotFoundPage from "./pages/notFound";
import ProfileCompletion from "./pages/profileCompletion";
import AccountEditPage from "./pages/editAccount";
import MealPlanList from "./pages/mealPlanList";
import MealPlan from "./pages/mealPlan.jsx";
import MealPlanForm from "./components/MealPlanForm.jsx";

function App() {
  const navigate = useNavigate();
  const {user, setUser} = useAuthStore();
  useEffect(() => {
    if (window.localStorage.getItem('loggedUser')) {
      const storageUser = JSON.parse(window.localStorage.getItem('loggedUser'));
      setToken(storageUser.token);
      setUser(storageUser);

      if (storageUser && !storageUser.infoCompleted) {
        console.log(storageUser)
        navigate('/complete-profile');
      }
    }
  }, [navigate, setUser]);
  return (
    <>
      <Navigation user={user}/>
      <div className='container py-3' style={{minHeight: "80vh"}}>
        <Notification/>
        <Routes>
          <Route path='/complete-profile' element={<ProfileCompletion/>}/>
          <Route path='/account/edit' element={<AccountEditPage/>}/>
          <Route path='/' element={<HomePage/>}/>
          <Route
            path='/login'
            element={user.token ? <Navigate to='/'/> : <LoginForm/>}
          />
          <Route
            path='/register'
            element={user.token ? <Navigate to='/'/> : <RegisterForm/>}
          />
          <Route
            path='/admin'
            element={<ProtectedRoute element={<AdminPage/>}/>}
          />
          <Route
            path='/dishes/saved'
            element={<ProtectedRoute element={<SavedDishesPage/>}/>}
          />
          <Route
            path='/user/:id'
            element={<ProtectedRoute element={<UserPage/>}/>}
          />
          <Route path='/dish/:id' element={<DishInformation/>}/>
          <Route path='/dishes' element={<DishesPage/>}/>
          <Route
            path='/dish/create'
            element={<ProtectedRoute element={<DishForm/>}/>}
          />
          <Route
            path='/dish/edit/:id'
            element={<ProtectedRoute element={<DishForm/>}/>}
          />
          <Route
            path='/meal-plans'
            element={<ProtectedRoute element={<MealPlanList/>}/>}
          />
          <Route
            path='/meal-plan/create'
            element={<ProtectedRoute element={<MealPlanForm/>}/>}
          />
          <Route
            path='/meal-plan/:id'
            element={<ProtectedRoute element={<MealPlan/>}/>}
          />
          <Route
            path='/meal-plan/edit/:id'
            element={<ProtectedRoute element={<MealPlanForm/>}/>}
          />

          <Route path='*' element={<NotFoundPage/>}/>
        </Routes>
      </div>
      <Footer/>
    </>
  );
}

export default App;
