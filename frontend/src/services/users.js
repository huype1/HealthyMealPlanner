import axios from "axios";
const baseUrl = "http://localhost:3001/api/users";
import { getConfig } from "./token";
import { useAuthStore } from "../stores";
const create = async (information) => {
  const response = await axios.post(baseUrl, information);
  return response.data;
};

const getAll = async (page, search, group, limit) => {

  const token = getConfig();
  const response = await axios.get(
    `${baseUrl}?search=${search}&&group=${group}&&page=${page}&&limit=${limit}`,
    token
  );
  if (response.status === 401) {
      throw new Error('Operation not permitted');
  }
  return response.data;
};
const get = async (id) => {
  const token = getConfig();
  const response = await axios.get(`${baseUrl}/${id}`, token);
  return response.data;
};
const status = async (newStatus, id) => {
  const token = getConfig();
  const response = await axios.put(
    `${baseUrl}/status/${id}`,
    { status: newStatus },
    token
  );
  return response.data;
};
const update = async (id, data) => {
  const token = getConfig();
  try {
    const response = await axios.put(
      `${baseUrl}/${id}`,
      data,
      token
    );
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
};

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, getConfig());
  return response.data;
};

export default { create, get, getAll, update, status, remove };
