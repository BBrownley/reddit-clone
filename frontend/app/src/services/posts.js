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
  console.log("Fetching posts (from services/posts)");
  const req = await axios.get("http://localhost:5000/", config);
  console.log(req);
  return req.data;
};

const createPost = async post => {
  const config = {
    headers: {
      Authorization: storedToken
    }
  };

  try {
    const req = await axios.post("http://localhost:5000/posts", post, config);
    console.log(req);
    return req.data;
  } catch (error) {
    return { error: error.response.data.error };
  }
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
