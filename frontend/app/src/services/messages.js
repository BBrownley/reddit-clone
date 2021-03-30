import axios from "axios";

let storedToken = null;

const config = {
  headers: {
    Authorization: storedToken
  }
};

const setToken = token => {
  storedToken = token;
};

const getAll = async () => {
  const config = {
    headers: {
      Authorization: storedToken
    }
  };

  const req = await axios.get("http://localhost:5000/messages", config);
  return req.data;
};

const send = async message => {
  const config = {
    headers: {
      Authorization: storedToken
    }
  };

  const req = await axios.post(
    "http://localhost:5000/messages",
    message,
    config
  );
  return req.data;
};

// Sends a notification to all followers of the post including the author
const sendAll = async (message, postId) => {
  await axios.post(
    `http://localhost:5000/messages/followers/${postId}`,
    { message },
    config
  );
};

const setRead = async id => {
  axios.put(`http://localhost:5000/messages`, { id }, config);
};

const deleteMessage = async id => {
  const headers = {
    Authorization: storedToken
  };
  axios.delete(`http://localhost:5000/messages`, {
    data: {
      id
    },
    headers
  });
};

const messageService = {
  setToken,
  getAll,
  send,
  sendAll,
  setRead,
  deleteMessage
};

export default messageService;
