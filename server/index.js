const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 5000; // Make it use .env variable later

app.use(cors());

const postsDB = require("./db/posts");

app.get("/", (req, res) => {
  res.json("world :)");
});

app.get("/groups/all", async (req, res) => {
  let posts = await postsDB.all();
  res.json(posts);
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
