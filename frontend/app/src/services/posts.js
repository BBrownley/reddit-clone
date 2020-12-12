import axios from "axios";
const baseUrl = "/posts";

const getAll = async () => {
  const req = await axios.get("http://localhost:3001/posts");
  console.log(req.data);
  return req.data;
};

export default {
  getAll
};
