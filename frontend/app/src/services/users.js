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
    // store.dispatch(timedNotification(error.response.data.error, 5000));
    return { error: error.response.data.error };
  }
};

const userService = {
  register,
  login
};

export default userService;
