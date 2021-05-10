import axios from "axios";

let storedToken = null;

const setToken = token => {
  storedToken = token;
};

const getCommentsByPostId = async postId => {
  const req = await axios.get(`http://localhost:5000/comments/post/${postId}`);
  return req.data;
};

const getCommentsByUserId = async userId => {
  const req = await axios.get(`http://localhost:5000/comments/users/${userId}`);
  const data = req.data.map(comment => {
    return {
      ...comment,
      type: "comment"
    };
  });
  return data;
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

const editComment = (id, updatedContent) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: storedToken
    }
  };

  axios.put(`http://localhost:5000/comments/${id}`, { updatedContent }, config);
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

const remove = id => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: storedToken
    }
  };

  axios.put(`http://localhost:5000/comments/${id}/remove`, null, config);
};

const getCommentScoreById = async id => {
  const req = await axios.get(`http://localhost:5000/comments/${id}/score`);
  return req.data.score;
};

export default {
  getCommentsByPostId,
  getRootCommentsByPostId,
  getCommentsByUserId,
  getCommentChildren,
  editComment,
  add,
  remove,
  getCommentScoreById,
  setToken
};
