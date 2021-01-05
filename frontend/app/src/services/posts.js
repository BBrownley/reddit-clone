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
  console.log(req.data);
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

const upvote = async post => {
  const newPostData = { ...post, votes: post.votes + 1 };
  const req = await axios.put(
    `http://localhost:3001/posts/${post.id}`,
    newPostData
  );
  return req.data;
};

const downvote = async post => {
  const newPostData = { ...post, votes: post.votes - 1 };
  const req = await axios.put(
    `http://localhost:3001/posts/${post.id}`,
    newPostData
  );
  return req.data;
};

export default {
  getAll,
  createPost,
  upvote,
  downvote,
  setToken
};
