const express = require("express");
const app = express();
const PORT = 3306; // Make it use .env variable later

const posts = require("./db/posts");

app.get("/", (req, res) => {
  res.json("world :)");
});

app.get("/api/posts", async (req, res) => {
  let blogs = await posts.all();
  console.log(blogs);
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
