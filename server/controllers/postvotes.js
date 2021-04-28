const postVotesRouter = require("express").Router();
const jwt = require("jsonwebtoken");

const connection = require("../db/index").connection;

postVotesRouter.put("/:id", async (req, res, next) => {
  const changePostVote = (postId, userId, updatedValue) => {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE post_votes
        SET vote_value = ?
        WHERE user_id = ? AND post_id = ?
      `;

      connection.query(
        query,
        [updatedValue, userId, postId],
        (err, results) => {
          if (err) {
            reject(new Error("Unable to change post vote"));
          } else {
            resolve();
          }
        }
      );
    });
  };

  try {
    console.log("Changing post vote...");
    const userToken = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(userToken, process.env.SECRET);
    await changePostVote(req.params.id, decodedToken.id, req.body.updatedValue);
  } catch (exception) {
    next(exception);
  }
});

postVotesRouter.delete("/:id", async (req, res, next) => {
  const deletePostVote = (postId, userId) => {
    return new Promise((resolve, reject) => {
      const query = `
        DELETE FROM post_votes
        WHERE post_id = ? AND user_id = ?
      `;
      connection.query(query, [postId, userId], (err, results) => {
        if (err) {
          reject(new Error("Unable to remove user post vote"));
        } else {
          resolve();
        }
      });
    });
  };
  try {
    const userToken = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(userToken, process.env.SECRET);
    await deletePostVote(req.params.id, decodedToken.id);
  } catch (exception) {
    next(exception);
  }
});

module.exports = postVotesRouter;
