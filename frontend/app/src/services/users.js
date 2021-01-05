import axios from "axios";

let token = null;

const setToken = token => {
  token = `bearer ${token}`;
};

const config = {
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  }
};

const register = async data => {
  const req = await axios.post("http://localhost:5000/users", data, config);
  console.log(req.data);
};

const login = async data => {
  const req = await axios.post(
    "http://localhost:5000/users/login",
    data,
    config
  );
  return req.data;
};

export default { register, login, setToken };
