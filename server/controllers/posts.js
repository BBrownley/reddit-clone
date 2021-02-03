const postsRouter = require("express").Router();
const postsDB = require("../db/posts");
const postVotesDB = require("../db/post_votes");

postsRouter.post("/", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const data = await postsDB.create(req.body, token);

    res.json(data);
  } catch (exception) {
    next(exception);
  }
});

postsRouter.post("/:id/vote", async (req, res) => {
  const token = req.headers.authorization;
  const postID = req.params.id;
  const vote = await postsDB.vote(req.body, postID, token);
  res.json(vote);
});

postsRouter.get("/votes", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const userPostVotes = await postVotesDB.getUserPostVotes(token);
    res.json(userPostVotes);
  } catch (exception) {
    next(exception);
  }
});

postsRouter.delete("/:id", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    await postsDB.deletePost(token, req.params.id);
  } catch (exception) {
    next(exception);
  }
});

module.exports = postsRouter;
