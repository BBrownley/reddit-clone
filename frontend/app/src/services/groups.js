import axios from "axios";
import baseUrl from "./utils/baseUrl";

let storedToken = null;

const setToken = token => {
  storedToken = token;
};

const config = {
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  }
};

const getAll = async () => {
  const req = await axios.get(`${baseUrl}/groups`, config);
  return req.data;
};

const getGroupByName = async groupName => {
  try {
    const req = await axios.get(`${baseUrl}/groups/${groupName}`, config);
    return req.data;
  } catch (exception) {
    return false;
  }
};

const create = async groupData => {
  const config = {
    headers: {
      Authorization: storedToken
    }
  };

  try {
    const req = await axios.post(`${baseUrl}/groups/create`, groupData, config);

    return req.data;
  } catch (error) {
    return { error: error.response.data.error };
  }
};

const subscribeToGroup = async group => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: storedToken
    }
  };

  try {
    const req = await axios.post(
      `${baseUrl}/groups/subscribe`,
      { id: group.group_id },
      config
    );
    return req.data;
  } catch (error) {
    return { error: error.response.data.error };
  }
};

const unsubscribe = async group => {
  const headers = {
    Authorization: storedToken
  };

  try {
    const req = await axios.delete(`${baseUrl}/groups/subscription`, {
      data: {
        id: group.group_id
      },
      headers
    });
    return req.data;
  } catch (error) {
    return { error: error.response.data.error };
  }
};

const getUserSubscriptions = async () => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: storedToken
    }
  };

  try {
    const req = await axios.get(`${baseUrl}/groups/subscriptions`, config);

    return req.data;
  } catch (error) {
    return [];
  }
};

const paginate = async page => {
  const req = await axios.get(`${baseUrl}/groups?page=${page}`);
  return req.data;
};

const countPages = async () => {
  const req = await axios.get(`${baseUrl}/groups/count`);
  return req.data.pages;
};

const verifyGroupByName = async groupName => {
  try {
    const req = await axios.get(
      `${baseUrl}/groups/verifyName?groupName=${groupName}`
    );
    return req.data;
  } catch (exception) {
    return false;
  }
};

const groupService = {
  getAll,
  getGroupByName,
  create,
  setToken,
  subscribeToGroup,
  unsubscribe,
  getUserSubscriptions,
  paginate,
  countPages,
  verifyGroupByName
};

export default groupService;
