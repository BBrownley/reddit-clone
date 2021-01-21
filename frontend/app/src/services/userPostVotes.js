import axios from "axios";

let storedToken = null;

const setToken = token => {
  console.log(token);
  console.log("Setting token...");
  storedToken = `bearer ${token}`;
  console.log(`Updated token: ${token}`);
};

const getUserPostVotes = async () => {
  console.log("user post votes reducer");

  const config = {
    headers: {
      Authorization: storedToken
    }
  };

  console.log(config);

  const req = await axios.get(`http://localhost:5000/posts/votes`, config);
  console.log(req.data);
  return req.data;
};

export default {
  getUserPostVotes,
  setToken
};
