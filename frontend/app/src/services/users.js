import axios from "axios";
import baseUrl from "./utils/baseUrl";

const config = {
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  }
};

const register = async data => {
  try {
    const req = await axios.post(`${baseUrl}/users`, data, config);
    return req.data;
  } catch (error) {
    return { error: error.response.data.error };
  }
};

const login = async data => {
  try {
    const req = await axios.post(`${baseUrl}/users/login`, data, config);

    return req.data;
  } catch (error) {
    return { error: error.response.data.error };
  }
};

const getUserById = async userId => {
  try {
    const req = await axios.get(`${baseUrl}/users/id/${userId}`);
    return req.data;
  } catch (error) {
    return { error: error.response.data.error };
  }
};

const getUserByUsername = async username => {
  try {
    const req = await axios.get(`${baseUrl}/users/username/${username}`);
    return req.data;
  } catch (error) {
    return { error: error.response.data.error };
  }
};

const userService = {
  register,
  login,
  getUserById,
  getUserByUsername
};

export default userService;
