const postsRouter = require("express").Router();
const postsDB = require("../db/posts");
const postVotesDB = require("../db/post_votes");
const connection = require("../db/index").connection;

postsRouter.post("/", async (req, res, next) => {
  try {
    const data = await postsDB.create(req.body, req.userId);
    res.json({ ...data, toastMessage: "Post created" });
  } catch (exception) {
    next(exception);
  }
});

postsRouter.post("/:id/vote", async (req, res, next) => {
  const vote = (data, postID, userId) => {
    return new Promise((resolve, reject) => {
      // Check to see if user already voted or not
      connection.query(
        `SELECT * FROM post_votes WHERE user_id = ? AND post_id = ?`,
        [userId, postID],
        (err, results) => {
          if (err) {
            reject(new Error("Unable to vote on post"));
          }
          // Add the vote
          connection.query(
            `INSERT INTO post_votes SET ? `,
            {
              user_id: userId,
              post_id: postID,
              vote_value: data.value
            },
            (err, results) => {
              if (err) {
                reject(err);
              } else {
                resolve();
                res.send(200);
              }
            }
          );
        }
      );
    });
  };

  try {
    const postID = req.params.id;
    const newVote = await vote(req.body, postID, req.userId);
    res.send(newVote);
  } catch (exception) {
    next(exception);
  }
});

postsRouter.get("/votes", async (req, res, next) => {
  if (req.userId === undefined) return;

  try {
    const userPostVotes = await postVotesDB.getUserPostVotes(req.userId);
    res.json(userPostVotes);
  } catch (exception) {
    next(exception);
  }
});

postsRouter.get("/follows", async (req, res, next) => {
  if (req.userId === undefined) return;

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
    res.send(200);
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

// Posts for the client when visiting the index page
postsRouter.get("/all", async (req, res, next) => {
  const getPosts = () => {
    const user = req.query.user;

    return new Promise((resolve, reject) => {
      let query;

      // Just get the most recent posts
      if (user === "null") {
        query = `
          SELECT * FROM posts
          ORDER BY created_at DESC
          LIMIT 20 OFFSET ${(parseInt(req.query.page) - 1) * 20}
        `;
      } else {
        // Get posts based on user's subscriptions. Return empty array if they have none

        query = `
          SELECT title, content, groups.group_name FROM posts
          JOIN groups ON groups.id = posts.group_id
          WHERE group_name IN 
            (SELECT group_name FROM group_subscribers 
            JOIN groups ON group_subscribers.group_id = groups.id 
            WHERE user_id = ?)
          ORDER BY posts.created_at DESC
          LIMIT 20 OFFSET ${(parseInt(req.query.page) - 1) * 20}
        `;
      }

      connection.query(query, [user], (err, results) => {
        if (err) {
          reject(new Error("Unable to get posts"));
        } else {
          resolve(results);
        }
      });
    });
  };

  try {
    const posts = await getPosts();
    res.json(posts);
  } catch (exception) {
    next(exception);
  }
});

// Count the maximum pages for pagination in the index page, no user logged in
postsRouter.get("/all/count", async (req, res, next) => {
  const countPages = () => {
    return new Promise((resolve, reject) => {
      const query = `
          SELECT COUNT(*) AS total FROM posts
        `;

      connection.query(query, [], (err, results) => {
        if (err) {
          reject(new Error("Unable to count pages"));
        } else {
          resolve({ pages: Math.ceil(Object.values(results[0])[0] / 20) });
        }
      });
    });
  };

  try {
    const pages = await countPages();
    res.json(pages);
  } catch (exception) {
    next(exception);
  }
});

// Count the maximum pages for pagination in the index page, user logged in
postsRouter.get("/all/count/user", async (req, res, next) => {
  const countPages = () => {
    return new Promise((resolve, reject) => {
      const query = `
          SELECT COUNT(*) FROM
          (
            SELECT title, content, groups.group_name FROM posts
            JOIN groups ON groups.id = posts.group_id
            WHERE group_name IN 
            (
              SELECT group_name FROM group_subscribers 
              JOIN groups ON group_subscribers.group_id = groups.id 
              WHERE user_id = ?
            )
          ) AS total
        `;

      connection.query(query, [req.userId], (err, results) => {
        if (err) {
          reject(new Error("Unable to count pages"));
        } else {
          resolve({ pages: Math.ceil(Object.values(results[0])[0] / 20) });
        }
      });
    });
  };

  try {
    const pages = await countPages();
    res.json(pages);
  } catch (exception) {
    next(exception);
  }
});

module.exports = postsRouter;

// postsRouter.get("/all/count", async (req, res, next) => {

//   const myFunc = () => {
//     console.log("func goes here")
//   }

//   try {
//     const data = await myFunc();
//     res.json(data)
//   } catch (exception) {
//     next(exception)
//   }
// })
