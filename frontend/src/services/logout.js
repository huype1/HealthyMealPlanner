import axios from 'axios'
const baseUrl = "http://localhost:3001/api/logout";
import { getConfig } from './token'

const logout = async () => {
  const response = await axios.delete(baseUrl, getConfig())
  return response.data
}

export default { logout }