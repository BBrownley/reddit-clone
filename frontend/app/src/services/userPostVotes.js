import axios from "axios";
import baseUrl from "./utils/baseUrl";

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

  const req = await axios.get(`${baseUrl}/posts/votes`, config);

  return req.data;
};

const removePostVote = async id => {
  const config = {
    headers: {
      Authorization: storedToken
    }
  };
  await axios.delete(`${baseUrl}/postvotes/${id}`, config);
};

const changePostVote = async (id, updatedValue) => {
  const config = {
    headers: {
      Authorization: storedToken
    }
  };

  axios.put(`${baseUrl}/postvotes/${id}`, { updatedValue }, config);
};

const userPostVotesService = {
  getUserPostVotes,
  setToken,
  removePostVote,
  changePostVote
};

export default userPostVotesService;
