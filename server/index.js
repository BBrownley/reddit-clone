const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = 5000; // Make it use .env variable later

require("dotenv").config();

app.use(cors());
app.use(bodyParser());

const postsDB = require("./db/posts");
const groupsDB = require("./db/groups");
const usersDB = require("./db/users");
const postVotesDB = require("./db/post_votes");

app.get("/", async (req, res) => {
  console.log("Fetching posts (from server/index.js)");
  let posts = await postsDB.all();
  res.json(posts);
});

app.get("/groups", async (req, res) => {
  let groups = await groupsDB.all();
  res.json(groups);
});

app.post("/posts", async (req, res) => {
  const token = req.headers.authorization;
  const data = await postsDB.create(req.body, token);
  res.json(data);
});

app.post("/users", async (req, res) => {
  const data = await usersDB.register(req.body);
  res.json(data);
});

app.post("/users/login", async (req, res, next) => {
  try {
    const data = await usersDB.login(req.body);
    res.json(data);
  } catch (exception) {
    // console.log("##### FROM THE TRY-CATCH BLOCK #####");
    // console.log(exception);
    // console.log("##### FROM THE TRY-CATCH BLOCK #####");
    next(exception);
  }
});

app.post("/posts/:id/vote", async (req, res) => {
  const token = req.headers.authorization;
  const postID = req.params.id;
  const vote = await postsDB.vote(req.body, postID, token);
  res.json(vote);
});

app.get("/posts/votes", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const userPostVotes = await postVotesDB.getUserPostVotes(token);
    res.json(userPostVotes);
  } catch (exception) {
    console.log("##### FROM THE TRY-CATCH BLOCK #####");
    console.log(exception);
    console.log("##### FROM THE TRY-CATCH BLOCK #####");
    next(exception);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

const errorHandler = (err, req, res, next) => {
  console.log("##### FROM THE ERROR HANDLER #####");
  console.log(err.name);
  console.log(err.message);
  console.log("##### FROM THE ERROR HANDLER #####");

  return res.status(400).json({ error: err.message });
  // if (err.name === "ValidationError") {
  //   console.log("hey");
  //   return res.status(400).json({ error: err.message });
  // } else {
  //   return res.status(401).json({ error: err.message });
  // }

  // try {

  // } catch (err) {
  //   next(err)
  // }
};

app.use(errorHandler);
