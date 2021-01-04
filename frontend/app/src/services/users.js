import axios from "axios";

const config = {
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  }
};

const register = async () => {
  const req = await axios.post("http://localhost:5000/users", config);
  console.log(req.data);
};

export default { register };
