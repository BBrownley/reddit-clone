const postsRouter = require("express").Router();
const postsDB = require("../db/posts");
const postVotesDB = require("../db/post_votes");
const connection = require("../db/posts").connection;
const jwt = require("jsonwebtoken");

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

postsRouter.get("/follows", async (req, res, next) => {
  const getPostFollows = user => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT post_id FROM post_follows
        WHERE user_id = ?
      `;
      connection.query(query, [user.id], (err, results) => {
        if (err) {
          reject(new Error(err.message));
        } else {
          resolve(
            results.reduce((acc, curr) => {
              return [...acc, curr.post_id];
            }, [])
          );
        }
      });
    });
  };
  try {
    const userToken = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(userToken, process.env.SECRET);
    const posts = await getPostFollows(decodedToken);
    res.json({ posts });
  } catch (exception) {
    next(exception);
  }
});

postsRouter.delete("/unfollow/:postId", async (req, res, next) => {
  const unfollowPost = (postId, user) => {
    return new Promise((resolve, reject) => {
      const query = `
        DELETE FROM post_follows
        WHERE post_id = ? AND user_id = ?
      `;
      connection.query(query, [postId, user.id], (err, results) => {
        if (err) {
          reject(new Error(err.message));
        } else {
          resolve(postId);
        }
      });
    });
  };
  try {
    console.log(req.headers.authorization);
    const userToken = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(userToken, process.env.SECRET);
    const unfollow = await unfollowPost(req.params.postId, decodedToken);
    res.json(unfollow);
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

postsRouter.get("/users/:userId", async (req, res, next) => {
  try {
    const userPosts = await postsDB.getPostsByUID(req.params.userId);
    res.json(userPosts);
  } catch (exception) {
    next(exception);
  }
});

postsRouter.post("/follow", async (req, res, next) => {
  const followPost = (postId, user) => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO post_follows
        SET ?
      `;
      connection.query(
        query,
        {
          user_id: user.id,
          post_id: postId
        },
        (err, results) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(postId);
          }
        }
      );
    });
  };
  try {
    const userToken = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(userToken, process.env.SECRET);
    const followedPost = await followPost(req.body.postId, decodedToken);
    res.json(followedPost);
  } catch (exception) {
    next(exception);
  }
});

module.exports = postsRouter;
