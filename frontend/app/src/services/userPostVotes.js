import axios from "axios";

let storedToken = null;

const setToken = token => {
  storedToken = token;
};

const getUserPostVotes = async () => {
   

  const config = {
    headers: {
      Authorization: storedToken
    }
  };

   

  const req = await axios.get(`http://localhost:5000/posts/votes`, config);
   
  return req.data;
};

export default {
  getUserPostVotes,
  setToken
};
