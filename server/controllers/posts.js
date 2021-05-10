const postsRouter = require("express").Router();
const postsDB = require("../db/posts");
const postVotesDB = require("../db/post_votes");
const connection = require("../db/posts").connection;

postsRouter.post("/", async (req, res, next) => {
  try {
    const data = await postsDB.create(req.body, req.userId);
    res.json({...data, toastMessage: "Post created"});
  } catch (exception) {
    next(exception);
  }
});

postsRouter.post("/:id/vote", async (req, res) => {
  const postID = req.params.id;
  const vote = await postsDB.vote(req.body, postID, req.userId);
  res.json(vote);
});

postsRouter.get("/votes", async (req, res, next) => {
  try {
    const userPostVotes = await postVotesDB.getUserPostVotes(req.userId);
    res.json(userPostVotes);
  } catch (exception) {
    next(exception);
  }
});

postsRouter.get("/follows", async (req, res, next) => {
  const getPostFollows = userId => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT post_id FROM post_follows
        WHERE user_id = ?
      `;
      connection.query(query, [userId], (err, results) => {
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
    const posts = await getPostFollows(req.userId);
    res.json({ posts });
  } catch (exception) {
    next(exception);
  }
});

postsRouter.delete("/unfollow/:postId", async (req, res, next) => {
  const unfollowPost = (postId, userId) => {
    return new Promise((resolve, reject) => {
      const query = `
        DELETE FROM post_follows
        WHERE post_id = ? AND user_id = ?
      `;
      connection.query(query, [postId, userId], (err, results) => {
        if (err) {
          reject(new Error(err.message));
        } else {
          resolve(postId);
        }
      });
    });
  };
  try {
    const unfollow = await unfollowPost(req.params.postId, req.userId);
    res.json(unfollow);
  } catch (exception) {
    next(exception);
  }
});

postsRouter.delete("/:id", async (req, res, next) => {
  try {
    await postsDB.deletePost(req.userId, req.params.id);
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
  const followPost = (postId, userId) => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO post_follows
        SET ?
      `;
      connection.query(
        query,
        {
          user_id: userId,
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
    const followedPost = await followPost(req.body.postId, req.userId);
    res.json(followedPost);
  } catch (exception) {
    next(exception);
  }
});

postsRouter.put("/:id", async (req, res, next) => {
  const editPost = (postId, newValue, userId) => {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE posts
        SET content = ?
        WHERE id = ? AND submitter_id = ?
      `;

      connection.query(query, [newValue, postId, userId], (err, results) => {
        if (err) {
          reject(new Error("Unable to edit post"));
        } else {
          resolve({ message: "Post succeessfully updated" });
        }
      });
    });
  };

  try {
    const success = await editPost(
      req.params.id,
      req.body.newValue,
      req.userId
    );
    res.json(success);
  } catch (exception) {
    next(exception);
  }
});

module.exports = postsRouter;
