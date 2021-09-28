import axios from "axios";
import baseUrl from "./utils/baseUrl";

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

  const req = await axios.get(`${baseUrl}/messages`, config);
  return req.data;
};

const send = async message => {
  const config = {
    headers: {
      Authorization: storedToken
    }
  };

  const req = await axios.post(
    `${baseUrl}/messages`,
    message,
    config
  );
  return req.data;
};

// Sends a notification to all followers of the post including the author
const sendAll = async (message, postId) => {
  const config = {
    headers: {
      Authorization: storedToken
    }
  };
  try {
    await axios.post(
      `${baseUrl}/messages/followers/${postId}`,
      { message },
      config
    );
  } catch (exception) {
    console.log(exception);
  }
};

const setRead = async id => {
  const config = {
    headers: {
      Authorization: storedToken
    }
  };
  axios.put(`${baseUrl}/messages`, { id }, config);
};

const deleteMessage = async id => {
  const headers = {
    Authorization: storedToken
  };
  axios.delete(`${baseUrl}/messages`, {
    data: {
      id
    },
    headers
  });
};

const paginate = async (options, page) => {
  const config = {
    headers: {
      Authorization: storedToken
    }
  };
  const req = await axios.get(
    `${baseUrl}/messages/paginate?filter=${options.type}&page=${page}`,
    config
  );
  return req.data;
};

const countPages = async options => {
  const config = {
    headers: {
      Authorization: storedToken
    }
  };
  const req = await axios.get(
    `${baseUrl}/messages/count?filter=${options.type}`,
    config
  );
  return req.data.pages;
};

const messageService = {
  setToken,
  getAll,
  send,
  sendAll,
  setRead,
  deleteMessage,
  paginate,
  countPages
};

export default messageService;
