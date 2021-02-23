import axios from "axios";

let storedToken = null;

const setToken = token => {
  storedToken = token;
};

const getAll = async () => {
  const config = {
    headers: {
      Authorization: storedToken
    }
  };

  const req = await axios.get("http://localhost:5000/messages", config);
  return req.data;
};

const messageService = {
  setToken,
  getAll
};

export default messageService;
