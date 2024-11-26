import axios from "axios";

const baseUrl = "http://localhost:3001/api/comments";
import {getConfig} from './token'

const create = async (data) => {
  const token = getConfig();
  const response = await axios.post(baseUrl, data, token);
  return response.data;
};
const getUserRating = async (data) => {
  const token = getConfig();
  console.log(data)
  const response = await axios.get(`${baseUrl}/${data.dishId}/${data.userId}`, token);
  return response.data;
}
const update = async (data, stepId) => {
  const token = getConfig();
  const response = await axios.put(`${baseUrl}/${stepId}`, data, token);
  return response.data;
}
const get = async (dishId) => {
  const response = await axios.get(`${baseUrl}/${dishId}`);
  return response.data;
};

const remove = async (dishId) => {
  const token = getConfig();
  const response = await axios.delete(`${baseUrl}/${dishId}`, token)
  console.log(response)
  return response.data
}
export default {create, update, get, getUserRating, remove};