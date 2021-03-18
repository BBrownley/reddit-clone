const bookmarksRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const connection = require("../db").connection;

bookmarksRouter.get("/", async (req, res, next) => {
  const getUserBookmarks = (userId, postId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT bookmarks.*, comments.post_id FROM bookmarks
        JOIN comments ON bookmarks.comment_id = comments.id
        WHERE user_id = ?
      `;

      connection.query(query, [userId], (err, results) => {
        if (err) {
          console.log(query);
          reject(new Error("Unable to get user bookmarks"));
        } else {
          resolve(results);
        }
      });
    });
  };
  try {
    const token = req.headers.authorization;
    console.log(token);
    console.log(token);
    console.log(token);
    console.log(token);
    console.log(token);
    console.log(token);
    const user = await jwt.verify(token.split(" ")[1], process.env.SECRET);

    const userBookmarks = await getUserBookmarks(user.id, req.body.postId);
    res.json(userBookmarks);
  } catch (exception) {
    next(exception);
  }
});

bookmarksRouter.get("/post/:postId", async (req, res, next) => {
  const getBookmarksByPostId = (userId, postId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT bookmarks.*, comments.post_id FROM bookmarks
        JOIN comments ON bookmarks.comment_id = comments.id
        WHERE user_id = ? AND post_id = ?
      `;
      connection.query(query, [userId, postId], (err, results) => {
        if (err) {
          reject(new Error("Unable to get user bookmarks (by post id)"));
        } else {
          resolve(results);
        }
      });
    });
  };

  try {
    const token = req.headers.authorization;

    console.log(token);
    console.log(token);

    const user = await jwt.verify(token.split(" ")[1], process.env.SECRET);

    const userPostBookmarks = await getBookmarksByPostId(
      user.id,
      req.params.postId
    );
    res.json(userPostBookmarks);
  } catch (exception) {
    next(exception);
  }
});

bookmarksRouter.post("/", async (req, res, next) => {
  const newBookmark = (userId, commentId) => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO bookmarks SET ?
      `;

      connection.query(
        query,
        {
          user_id: userId,
          comment_id: commentId
        },
        (err, results) => {
          if (err) {
            console.log(err.message);
            reject(new Error("Unable to create new bookmark"));
          } else {
            const query = `
            SELECT * FROM bookmarks
            WHERE user_id = ? AND comment_id = ?
          `;
            connection.query(query, [userId, commentId], (err, results) => {
              if (err) {
                reject(new Error("Unable to get recently created bookmark"));
              } else {
                resolve(results[0]);
              }
            });
          }
        }
      );
    });
  };

  try {
    const token = req.headers.authorization;
    const user = await jwt.verify(token.split(" ")[1], process.env.SECRET);

    console.log(user.id);
    console.log(req.body.commentId);

    const bookmark = await newBookmark(user.id, req.body.commentId);
    res.json(bookmark);
  } catch (exception) {
    next(exception);
  }
});

bookmarksRouter.delete("/", async (req, res, next) => {
  const deleteBookmark = (userId, commentId) => {
    return new Promise((resolve, reject) => {
      const query = `
        DELETE FROM bookmarks
        WHERE user_id = ? AND comment_id = ?
      `;

      connection.query(query, [userId, commentId], (err, results) => {
        if (err) {
          reject(new Error("Unable to delete comment"));
        } else {
          resolve();
        }
      });
    });
  };

  try {
    const token = req.headers.authorization;
    const user = await jwt.verify(token.split(" ")[1], process.env.SECRET);

    await deleteBookmark(user.id, req.body.commentId);
  } catch (exception) {
    next(exception);
  }
});

module.exports = bookmarksRouter;
