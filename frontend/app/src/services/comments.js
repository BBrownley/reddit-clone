import axios from "axios";

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
  console.log(req);
  return req.data;
};

export default {
  getCommentsByPostId,
  getRootCommentsByPostId,
  getCommentChildren
};
