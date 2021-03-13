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

  const req = await axios.post(
    `http://localhost:5000/commentvotes`,
    {
      commentId,
      value
    },
    config
  );

  console.log(req);

  return req.data;
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

const changeVote = async (commentId, newValue) => {
  const config = {
    headers: {
      Authorization: storedToken
    }
  };

  const body = {
    commentId,
    newValue
  }
  const req = await axios.put(
    `http://localhost:5000/commentvotes`,
    body,
    config
  );

  return req.data;
}

const commentVotesService = {
  setToken,
  getVotes,
  vote,
  removeVote,
  changeVote
};

export default commentVotesService;
