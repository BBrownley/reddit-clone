const commentsRouter = require("express").Router();
const connection = require("../db/index").connection;
const jwt = require("jsonwebtoken");

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
          username,
          users.id AS user_id
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
          username,
          users.id AS user_id
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

commentsRouter.post("/", async (req, res, next) => {
  const token = req.headers.authorization;
  const decodedToken = jwt.verify(token.split(" ")[1], process.env.SECRET);
  console.log(req.body);
  const postComment = () => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO comments SET ?
      `;

      connection.query(
        query,
        {
          commenter_id: decodedToken.id,
          parent_id: req.body.parentId,
          content: req.body.comment,
          post_id: req.body.postId
        },
        (err, results) => {
          if (err) {
            reject(new Error(err));
          } else {
            const query = `
              SELECT * FROM comments
              WHERE id = ?
            `;
            connection.query(query, [results.insertId], (err, results) => {
              resolve({
                ...results[0],
                comment_id: results[0].id,
                username: decodedToken.username
              });
            });
          }
        }
      );
    });
  };
  try {
    const newComment = await postComment();
    res.json(newComment);
  } catch (exception) {
    next(exception);
  }
});

module.exports = commentsRouter;
