import axios from "axios";

let storedToken = null;

const setToken = token => {
  storedToken = token;
};

const getCommentsByPostId = async postId => {
  const req = await axios.get(`http://localhost:5000/comments/post/${postId}`);
  return req.data;
};

const getRootCommentsByPostId = async postId => {
  const req = await axios.get(`http://localhost:5000/comments/post/${postId}`);
  return req.data.filter(comment => comment.parent_id === null);
};

const getCommentChildren = async commentId => {
  const req = await axios.get(
    `http://localhost:5000/comments/${commentId}/children`
  );
  return req.data;
};

const add = async (user, comment, postId, parentId) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: storedToken
    }
  };

  const newComment = {
    comment,
    postId,
    parentId
  };

  const req = await axios.post(
    `http://localhost:5000/comments/`,
    newComment,
    config
  );
  return req.data;
};

export default {
  getCommentsByPostId,
  getRootCommentsByPostId,
  getCommentChildren,
  add,
  setToken
};
