const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = 5000; // Make it use .env variable later

require("dotenv").config();

app.use(cors());
app.use(bodyParser());

const postsDB = require("./db/posts");

const groupsRouter = require("./controllers/groups");
const postsRouter = require("./controllers/posts");
const usersRouter = require("./controllers/users");
const commentsRouter = require("./controllers/comments");
const messageRouter = require("./controllers/messages");
const commentvotesRouter = require("./controllers/commentvotes");
const bookmarksRouter = require("./controllers/bookmarks");
const postVotesRouter = require("./controllers/postvotes");

app.use("/groups", groupsRouter);
app.use("/posts", postsRouter);
app.use("/users", usersRouter);
app.use("/comments", commentsRouter);
app.use("/messages", messageRouter);
app.use("/commentvotes", commentvotesRouter);
app.use("/bookmarks", bookmarksRouter);
app.use("/postvotes", postVotesRouter);

app.get("/", async (req, res) => {
  let posts = await postsDB.all();
  res.json(posts);
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

const errorHandler = (err, req, res, next) => {
  console.log("##### FROM THE ERROR HANDLER #####");
  console.log(err);
  console.log(err.name);
  console.log(err.message);
  console.log("##### FROM THE ERROR HANDLER #####");

  return res.status(400).json({ error: err.message });
};

app.use(errorHandler);
