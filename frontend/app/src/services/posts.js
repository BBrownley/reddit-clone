import axios from "axios";

import usersService from "./users";

let storedToken = null;

const setToken = token => {
  console.log("Setting token...");
  storedToken = `bearer ${token}`;
  console.log(`Updated token: ${token}`);
};

const config = {
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  }
};

const getAll = async () => {
  const req = await axios.get("http://localhost:5000/", config);
  return req.data;
};

const createPost = async post => {
  console.log(storedToken);

  const config = {
    headers: {
      Authorization: storedToken
    }
  };

  console.log(config);

  const req = await axios.post("http://localhost:5000/posts", post, config);

  return req.data;
};

const vote = async (postID, value) => {
  const config = {
    headers: {
      Authorization: storedToken
    }
  };
  const body = {
    value
  };
  const data = await axios.post(
    `http://localhost:5000/posts/${postID}/vote`,
    body,
    config
  );
  console.log(data);
  return data;
};

export default {
  getAll,
  createPost,
  setToken,
  vote
};
