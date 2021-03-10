const commentvotesRouter = require("express").Router();
const connection = require("../db/index").connection;
const jwt = require("jsonwebtoken");

commentvotesRouter.get("/", async (req, res, next) => {
  const getVotes = userId => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT comment_id, vote_value, post_id FROM comment_votes
        JOIN comments ON comments.id = comment_votes.comment_id
        WHERE user_id = ?
      `;
      connection.query(query, [userId], (err, results) => {
        if (err) {
          reject(new Error("Unable to fetch user comment votes"));
        } else {
          resolve(results);
        }
      });
    });
  };

  try {
    const token = req.headers.authorization;
    const decodedToken = await jwt.verify(
      token.split(" ")[1],
      process.env.SECRET
    );
    const userId = decodedToken.id;

    const userCommentVotes = await getVotes(userId);

    res.json(userCommentVotes);
  } catch (exception) {
    next(exception);
  }
});

module.exports = commentvotesRouter;
