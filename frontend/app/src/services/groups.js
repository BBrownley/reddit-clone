import axios from "axios";

let storedToken = null;

const setToken = token => {
  console.log("Setting token...");
  storedToken = `bearer ${token}`;
  console.log(`Updated token: ${token}`);
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

export default { getAll, getGroupByName, create, setToken };
