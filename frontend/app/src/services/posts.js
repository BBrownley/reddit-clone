import axios from "axios";
const baseUrl = "/";

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
  const dummyDefaultData = {
    ...post.data,
    author: "Admin",
    votes: 1,
    followers: 0,
    comments: [],
    group: "general",
    age: 60
  };

  const postInfo = { ...post, ...dummyDefaultData };

  const req = await axios.post("http://localhost:3001/posts", postInfo);
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
  downvote
};
