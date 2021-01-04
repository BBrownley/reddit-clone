const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = 5000; // Make it use .env variable later

app.use(cors());
app.use(bodyParser());

const postsDB = require("./db/posts");
const groupsDB = require("./db/groups");
const usersDB = require("./db/users");

app.get("/", async (req, res) => {
  let posts = await postsDB.all();
  res.json(posts);
});

app.get("/groups", async (req, res) => {
  let groups = await groupsDB.all();
  res.json(groups);
});

app.post("/posts", async (req, res) => {
  const data = await postsDB.create(req.body);
  console.log(data);
  res.json(data);
});

app.post("/users", async (req, res) => {
  console.log("~~~~req.body~~~~");
  console.log(req.body);
  console.log("~~~~~~~");
  const data = await usersDB.register(req.body);
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
