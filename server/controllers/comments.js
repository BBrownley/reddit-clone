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
        parent_id,
        content,
        post_id,
        users.id AS user_id,
        users.username AS username,
        deleted,
        (
        SELECT CASE WHEN
            SUM(vote_value) < 1 OR SUM(vote_value) IS NULL THEN 0 
            ELSE SUM(vote_value)
        END
        ) AS comment_score FROM comments

      LEFT JOIN comment_votes ON comment_votes.comment_id = comments.id
      JOIN users ON comments.commenter_id = users.id
      WHERE post_id = ?
      GROUP BY comments.id
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

commentsRouter.get("/users/:userId", async (req, res, next) => {
  const fetchUserComments = uid => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT comments.*, posts.title AS post_title, groups.group_name AS group_name FROM comments
        JOIN posts ON comments.post_id = posts.id
        JOIN groups ON posts.group_id = groups.id
        WHERE commenter_id = ?
      `;
      connection.query(query, [uid], (err, results) => {
        if (err) {
          reject(new Error("Unable to fetch user comments"));
        } else {
          resolve(results);
        }
      });
    });
  };

  try {
    const userComments = await fetchUserComments(req.params.userId);
    res.json(userComments);
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
          parent_id,
          content,
          post_id,
          users.id AS user_id,
          users.username AS username,
          deleted,
          (
          SELECT CASE WHEN
              SUM(vote_value) < 1 OR SUM(vote_value) IS NULL THEN 0 
              ELSE SUM(vote_value)
          END
          ) AS comment_score FROM comments

        LEFT JOIN comment_votes ON comment_votes.comment_id = comments.id
        JOIN users ON comments.commenter_id = users.id
        WHERE parent_id = ?
        GROUP BY comments.id
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
  const postComment = () => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO comments SET ?
      `;

      connection.query(
        query,
        {
          commenter_id: token.id,
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
                username: token.username
              });
            });
          }
        }
      );
    });
  };
  try {
    const token = req.headers.authorization;
    const decodedToken = await jwt.verify(
      token.split(" ")[1],
      process.env.SECRET
    );

    const newComment = await postComment(decodedToken);
    res.json(newComment);
  } catch (exception) {
    next(exception);
  }
});

commentsRouter.put(`/:commentId`, async (req, res, next) => {
  const updateComment = (updatedContent, commentId) => {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE comments
        SET content = ?
        WHERE id = ?
      `;

      connection.query(query, [updatedContent, commentId], (err, results) => {
        if (err) {
          reject(new Error("Unable to update comment"));
        } else {
          resolve({ message: "Comment successfully updated" });
        }
      });
    });
  };

  try {
    await updateComment(req.body.updatedContent, req.params.commentId);
    res.sendStatus(200);
  } catch (exception) {
    next(exception);
  }
});

commentsRouter.put("/:commentId/remove", async (req, res, next) => {
  const removeComment = commentId => {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE comments
        SET content = "comment removed", deleted = "Y"
        WHERE id = ?        
      `;
      connection.query(query, [commentId], (err, results) => {
        if (err) {
          reject(new Error("Unable to remove comment"));
        } else {
          resolve({ message: "Comment successfully removed" });
        }
      });
    });
  };

  try {
    const token = req.headers.authorization;
    await jwt.verify(token.split(" ")[1], process.env.SECRET);
    const success = await removeComment(req.params.commentId);
    res.send(success);
  } catch (exception) {
    next(exception);
  }
});

module.exports = commentsRouter;
