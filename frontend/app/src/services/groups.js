import axios from "axios";


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
  const req = await axios.get(`http://localhost:5000/groups/${groupName}`, config);
  return req.data;
}

export default { getAll, getGroupByName };
