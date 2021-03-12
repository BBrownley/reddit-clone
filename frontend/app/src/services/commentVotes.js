import axios from "axios";

let storedToken = null;
const setToken = token => {
  storedToken = token;
};

const getVotes = async () => {
  const config = {
    headers: {
      Authorization: storedToken
    }
  };

  const req = await axios.get("http://localhost:5000/commentvotes", config);
  return req.data;
};

// Returns an object with properties {comment_id, vote_value}
const vote = async (commentId, value) => {
  const config = {
    headers: {
      Authorization: storedToken
    }
  };

  const voteObj = await axios.post(
    `http://localhost:5000/commentvotes`,
    {
      commentId,
      value
    },
    config
  );
  return voteObj;
};

const removeVote = commentId => {
  const headers = {
    Authorization: storedToken
  };
  axios.delete("http://localhost:5000/commentvotes", {
    data: {
      commentId
    },
    headers
  });
};

const commentVotesService = {
  setToken,
  getVotes,
  vote,
  removeVote
};

export default commentVotesService;
