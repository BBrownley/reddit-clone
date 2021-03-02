const usersRouter = require("express").Router();
const usersDB = require("../db/users");
const postsDB = require("../db/posts");

usersRouter.post("/", async (req, res, next) => {
  try {
    const data = await usersDB.register(req.body.data);
    res.json(data);
  } catch (exception) {
    next(exception);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  try {
    let data = await usersDB.login(req.body);
    data = {
      ...data,
      userPosts: await postsDB.getPostsByToken(data.token),
      postFollows: await postsDB.getPostFollows(data.token)
    };
    res.json(data);
  } catch (exception) {
    next(exception);
  }
});

usersRouter.get("/:userId", async (req, res, next) => {
  try {
    let data = await usersDB.getUserById(req.params.userId);
    res.json(data);
  } catch (exception) {
    next(exception);
  }
});

module.exports = usersRouter;
