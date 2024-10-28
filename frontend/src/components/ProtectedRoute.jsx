import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/";
import loginService from "../services/login";
import CustomSpinner from "./CustomSpinner";

const ProtectedRoute = ({ element }) => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        const result = await loginService.tokenValid();
        setIsValid(result);
        setIsLoading(false);
      } catch (error) {
        console.log("Routing error", error);
        setIsLoading(false);
        setIsValid(false);
      }
    };

    checkTokenValidity();
  }, []);

  if (isLoading) {
    return <CustomSpinner/>;
  }

  return isValid ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;