import axios from "axios";

let storedToken = null;

const setToken = token => {
  storedToken = token;
};

const getUserPostVotes = async () => {
  const config = {
    headers: {
      Authorization: storedToken
    }
  };

  const req = await axios.get(`http://localhost:5000/posts/votes`, config);

  return req.data;
};

const removePostVote = async id => {
  const config = {
    headers: {
      Authorization: storedToken
    }
  };
  await axios.delete(`http://localhost:5000/postvotes/${id}`, config);
};

const changePostVote = async (id, updatedValue) => {
  const config = {
    headers: {
      Authorization: storedToken
    }
  };

  axios.put(`http://localhost:5000/postvotes/${id}`, { updatedValue }, config);
};

const userPostVotesService = {
  getUserPostVotes,
  setToken,
  removePostVote,
  changePostVote
};

export default userPostVotesService;
