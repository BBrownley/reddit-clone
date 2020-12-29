import axios from "axios";
const baseUrl = "/";

const config = {
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  }
};

const getAll = async () => {
  const req = await axios.get("http://localhost:5000/groups", config);
  console.log(req.data);
  return req.data;
};

export default { getAll };
