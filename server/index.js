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

// TODO: Change this route pattern later
app.post("/create/groups", async (req, res, next) => {
  console.log(req.body);
  try {
    const token = req.headers.authorization;
    const createdGroup = await groupsDB.create(req.body, token);
    console.log(`CREATED GROUP: ${createdGroup}`);
    res.json(createdGroup);
  } catch (exception) {
    next(exception);
  }
});

app.post("/posts", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const data = await postsDB.create(req.body, token);

    res.json(data);
  } catch (exception) {
    next(exception);
  }
});

app.post("/users", async (req, res, next) => {
  try {
    const data = await usersDB.register(req.body.data);
    res.json(data);
  } catch (exception) {
    next(exception);
  }
});

app.post("/users/login", async (req, res, next) => {
  try {
    let data = await usersDB.login(req.body);
    console.log(`From login route line 69: ${JSON.stringify(data)}`);

    data = { ...data, userPosts: await postsDB.getPostsByToken(data.token) };
    console.log(`From login route like 72: ${JSON.stringify(data)}`);
    res.json(data);
  } catch (exception) {
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
    next(exception);
  }
});

app.delete("/posts/:id", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    await postsDB.deletePost(token, req.params.id);
  } catch (exception) {
    next(exception);
  }
});

app.post("/groups/subscribe", async (req, res, next) => {
  try {
    console.log(req.body);
    const token = req.headers.authorization;
    const subscriptionInfo = await groupsDB.subscribe(req.body.id, token);
    res.json(subscriptionInfo);
  } catch (exception) {
    next(exception);
  }
});

app.delete("/groups/subscription", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.log("TOKEN");
    console.log(token);
    console.log("TOKEN");
    const unsub = await groupsDB.unsubscribe(req.body.id, token);
    res.json(unsub);
  } catch (exception) {
    next(exception);
  }
});

app.get("/groups/subscriptions", async (req, res, next) => {
  console.log("Pog");
  try {
    console.log("Pog");
    const token = req.headers.authorization;
    const subscriptions = await groupsDB.getSubscriptions(token);
    console.log(subscriptions);
    res.json(subscriptions);
  } catch (exception) {
    console.log("##### FROM THE TRY-CATCH BLOCK #####");
    console.log(exception);
    console.log("##### FROM THE TRY-CATCH BLOCK #####");
    next(exception);
  }
});

app.get("/groups/:groupName", async (req, res) => {
  let group = await groupsDB.getGroupByName(req.params.groupName);
  res.json(group);
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
};

app.use(errorHandler);
