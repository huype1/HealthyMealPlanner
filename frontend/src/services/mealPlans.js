import axios from "axios";

const baseUrl = "http://localhost:3001/api/meal-plans";
import {getConfig} from "./token";

const create = async (information) => {
  const token = getConfig();
  const response = await axios.post(baseUrl, information, token);
  return response.data;
};

const getAll = async (
  diet,
  name,
  minCalories,
  maxCalories,
  limit = 3,
  page = 1,
) => {
  const params = new URLSearchParams();
  const token = getConfig();
  if (name) params.append('name', name);
  if (diet) params.append('diet', diet);
  if (minCalories) params.append('minCalories', minCalories);
  if (maxCalories) params.append('maxCalories', maxCalories);
  params.append('limit', limit);
  params.append('page', page);
  const response = await axios.get(`${baseUrl}?${params.toString()}`, token);
  return response.data;
};

const get = async (id) => {
  const token = getConfig();
  const response = await axios.get(`${baseUrl}/${id}`, token);
  if (response.status === 404) {
    throw new Error('Cannot find meal plan');
  }
  return response.data;
};
const update = async (data) => {
  try {
    const response = await axios.put(
      `${baseUrl}/${data.id}`,
      data,
      getConfig()
    );
    console.log(response)
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
};

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, getConfig());
  console.log(response)
  return response;
};

export default {create, get, getAll, update, remove};
