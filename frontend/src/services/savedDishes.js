import axios from "axios";
const baseUrl = "http://localhost:3001/api/save-dish";
import { getConfig } from './token'
const create = async (information) => {
  const token = getConfig()
  const response = await axios.post(baseUrl, information, token);
  return response.data;
};
const isSaved = async (userId, dishId) => {
  const token = getConfig();
  const response = await axios.get(`${baseUrl}/${userId}/${dishId}`,  token)
  return response.data.isSaved
}
const getAll = async (
  userId,
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
  const token = getConfig();
  const params = new URLSearchParams();

  if (name) params.append('name', name);
  if (diet) params.append('diet', diet);
  if (allergies && allergies.length > 0) params.append('allergies', allergies.join(','));
  if (minCalories) params.append('minCalories', minCalories);
  if (maxCalories) params.append('maxCalories', maxCalories);
  if (mealType) params.append('mealType', mealType);
  if (cuisine) params.append('cuisine', cuisine);
  params.append('page', page);
  params.append('limit', limit);

  // Make GET request with query parameters
  const response = await axios.get(`${baseUrl}/${userId}?${params.toString()}`, token);
  console.log(response.data)
  return response.data;
};

const remove = async (userId, dishId) => {
  const response = await axios.delete(`${baseUrl}/${userId}/${dishId}`, getConfig())
  return response.data
}
export default { create, isSaved, getAll, remove };

