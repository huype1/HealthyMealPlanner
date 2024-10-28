import axios from "axios";
const baseUrl = "http://localhost:3001/api/dishes";
import { getConfig } from "./token";
const create = async (information) => {
  const token = getConfig();
  const response = await axios.post(baseUrl, information, token);
  return response.data;
};

const getAll = async (
  diet,
  allergies,
  name,
  minCalories,
  maxCalories,
  mealType,
  cuisine,
  page = 1,
  limit = 8
) => {
  // Construct query parameters dynamically
  const params = new URLSearchParams();

  if (name) params.append('name', name);
  if (diet) params.append('diet', diet);
  if (allergies && allergies.length > 0) params.append('allergies', allergies.join(',')); // Join allergies array
  if (minCalories) params.append('minCalories', minCalories);
  if (maxCalories) params.append('maxCalories', maxCalories);
  if (mealType) params.append('mealType', mealType);
  if (cuisine) params.append('cuisine', cuisine);
  params.append('page', page);
  params.append('limit', limit);

  // Make GET request with query parameters
  const response = await axios.get(`${baseUrl}?${params.toString()}`);
  return response.data;
};

const get = async (id) => {
  const token = getConfig();
  const response = await axios.get(`${baseUrl}/${id}`, token);
  if (response.status === 404) {
      throw new Error('Cannot find dish');
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
  return response.data;
};

export default { create, get, getAll, update, remove };
