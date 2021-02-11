const commentsRouter = require("express").Router();
const connection = require("../db/index").connection;

commentsRouter.get("/post/:postId", async (req, res, next) => {
  const fetchComments = () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT  
          comments.id AS comment_id,
          commenter_id,
          comments.created_at AS created_at,
          content,
          post_id,
          parent_id,
          username
        FROM comments
        JOIN users ON comments.commenter_id = users.id
        WHERE post_id = ?
      `;
      connection.query(query, [req.params.postId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  };
  try {
    const comments = await fetchComments();
    res.json(comments);
  } catch (exception) {
    next(exception);
  }
});

commentsRouter.get("/:commentId/children", async (req, res, next) => {
  const fetchChildren = () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT  
          comments.id AS comment_id,
          commenter_id,
          comments.created_at AS created_at,
          content,
          post_id,
          username
        FROM comments
        JOIN users ON comments.commenter_id = users.id
        WHERE parent_id = ?
      `;
      connection.query(query, [req.params.commentId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  };
  try {
    const comments = await fetchChildren();
    res.json(comments);
  } catch (exception) {
    next(exception);
  }
});

module.exports = commentsRouter;
