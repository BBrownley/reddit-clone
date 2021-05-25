import axios from "axios";

let storedToken = null;
const baseUrl = process.env.BASE_URL || "http://localhost:5000";

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
  const req = await axios.get("http://localhost:5000/groups", config);
  return req.data;
};

const getGroupByName = async groupName => {
  try {
    const req = await axios.get(
      `http://localhost:5000/groups/${groupName}`,
      config
    );
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
    const req = await axios.post(
      `http://localhost:5000/groups/create`,
      groupData,
      config
    );

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
      "http://localhost:5000/groups/subscribe",
      { id: group.id },
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
    const req = await axios.delete(
      "http://localhost:5000/groups/subscription",
      {
        data: {
          id: group.group_id
        },
        headers
      }
    );
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
    const req = await axios.get(
      "http://localhost:5000/groups/subscriptions",
      config
    );

    return req.data;
  } catch (error) {
    return [];
  }
};

const paginate = async page => {
  const req = await axios.get(`${baseUrl}/groups?page=${page}`);
  console.log(req.data);
  return req.data;
};

const countPages = async () => {
  const req = await axios.get(`${baseUrl}/groups/count`);
  console.log(req.data.pages);
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
