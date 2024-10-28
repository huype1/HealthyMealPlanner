import axios from "axios";
import { getConfig } from "./token";
//use apiClient for token handling middleware
const baseUrl = "http://localhost:3001/api/login";
const tokenValid = async () => {
  try {
    const response = await axios.get(baseUrl, getConfig());
    return response.status === 200;
  } catch (error) {
    console.log("authentication error", error);
    return false;
  }
};
const login = async (information) => {
  const response = await axios.post(baseUrl, information);
  return response.data;
};

export default { login, tokenValid };
