const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 5000; // Make it use .env variable later

app.use(cors());

const postsDB = require("./db/posts");
const groupsDB = require("./db/groups");

app.get("/", async (req, res) => {
  let posts = await postsDB.all();
  res.json(posts);
});

app.get("/groups", async (req, res) => {
  let groups = await groupsDB.all();
  res.json(groups);
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
