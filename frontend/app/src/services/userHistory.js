import axios from "axios";

let storedToken = null;
const baseUrl = process.env.BASE_URL || "http://localhost:5000";

const setToken = token => {
  storedToken = token;
};

const config = {
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  }
};

const paginate = async (options, page) => {
  const req = await axios.get(
    `${baseUrl}/userhistory/paginate?filter=${options.type}&page=${page}&user=${options.userId}`
  );
  console.log(req.data);
  return req.data;
};

const countPages = async options => {
  const req = await axios.get(
    `${baseUrl}/userhistory/count?filter=${options.type}&user=${options.userId}`
  );
  console.log(req.data);
  return req.data.pages;
};

const userHistoryService = {
  setToken,
  paginate,
  countPages
};

export default userHistoryService;
