import axios from "axios";
const baseUrl = "/posts";

const getAll = async () => {
  const req = await axios.get("http://localhost:3001/posts");
  console.log(req.data);
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
  upvote,
  downvote
};
