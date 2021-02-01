import axios from "axios";

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
  const req = await axios.get("http://localhost:5000/groups", config);
  return req.data;
};

const getGroupByName = async groupName => {
  const req = await axios.get(
    `http://localhost:5000/groups/${groupName}`,
    config
  );
  return req.data;
};

const create = async groupData => {
  console.log(groupData);

  const config = {
    headers: {
      Authorization: storedToken
    }
  };

  try {
    const req = await axios.post(
      `http://localhost:5000/create/groups`,
      groupData,
      config
    );
    console.log(req.data);
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
      group,
      config
    );
    return req.data;
  } catch (error) {
    return { error: error.response.data.error };
  }
};

const unsubscribe = async group => {
  console.log(storedToken);

  const headers = {
    Authorization: storedToken
  };

  try {
    const req = await axios.delete(
      "http://localhost:5000/groups/subscription",
      {
        data: {
          id: group.id
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
  console.log("hi");
  try {
    const req = await axios.get(
      "http://localhost:5000/groups/subscriptions",
      config
    );
    console.log(req);
    return req.data;
  } catch (error) {
    return { error: error.response.data.error };
  }
};

export default {
  getAll,
  getGroupByName,
  create,
  setToken,
  subscribeToGroup,
  unsubscribe,
  getUserSubscriptions
};
