import axios from "axios";

const config = {
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  }
};

const register = async data => {
  try {
    const req = await axios.post("http://localhost:5000/users", data, config);
    return req.data;
  } catch (error) {
    return { error: error.response.data.error };
  }
};

const login = async data => {
  try {
    const req = await axios.post(
      "http://localhost:5000/users/login",
      data,
      config
    );

    return req.data;
  } catch (error) {
    return { error: error.response.data.error };
  }
};

const getUserById = async userId => {
  try {
    const req = await axios.get(`http://localhost:5000/users/id/${userId}`);
    return req.data;
  } catch (error) {
    return { error: error.response.data.error };
  }
};

const getUserByUsername = async username => {
  try {
    const req = await axios.get(
      `http://localhost:5000/users/username/${username}`
    );
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
