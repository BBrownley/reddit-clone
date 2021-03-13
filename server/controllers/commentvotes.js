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
    // TODO: Can we separate this logic into its own middleware?
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

commentvotesRouter.post("/", async (req, res, next) => {
  const addVote = (userId, commentId, value) => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO comment_votes
        SET ?
      `;
      connection.query(
        query,
        {
          user_id: userId,
          comment_id: commentId,
          vote_value: value
        },
        (err, results) => {
          if (err) {
            reject(new Error("Unable to vote on comment"));
          } else {
            const query = `
              SELECT comment_id, vote_value, post_id FROM comment_votes
              JOIN comments ON comments.id = comment_votes.comment_id
              WHERE user_id = ? AND comment_id = ?
            `;

            connection.query(query, [userId, commentId], (err, results) => {
              if (err) {
                reject(
                  new Error("Unable to fetch recently generated comment vote")
                );
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
    const decodedToken = await jwt.verify(
      token.split(" ")[1],
      process.env.SECRET
    );

    const userId = decodedToken.id;
    const commentId = req.body.commentId;
    const value = req.body.value;

    const newVote = await addVote(userId, commentId, value);
    res.json(newVote);
  } catch (exception) {
    next(exception);
  }
});

commentvotesRouter.put("/", async (req, res, next) => {
  const updateVote = (userId, commentId, newValue) => {
    return new Promise((resolve, reject) => {
      console.log(newValue);
      console.log(commentId);
      console.log(userId);
      const query = `
        UPDATE comment_votes
        SET vote_value = ?
        WHERE comment_id = ? AND user_id = ?
      `;
      connection.query(query, [newValue, commentId, userId], (err, results) => {
        if (err) {
          reject(new Error("Unable to update comment vote"));
        } else {
          const query = `
            SELECT comment_id, vote_value, post_id FROM comment_votes
            JOIN comments ON comments.id = comment_votes.comment_id
            WHERE comment_id = ? AND user_id = ?
          `;
          connection.query(query, [commentId, userId], (err, results) => {
            if (err) {
              console.log("Unable to fetch recently updated comment");
              reject(new Error("Unable to fetch recently updated comment"));
            } else {
              resolve(results[0]);
            }
          });
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

    const updatedVote = await updateVote(
      decodedToken.id,
      req.body.commentId,
      req.body.newValue
    );
    res.json(updatedVote);
  } catch (exception) {
    next(exception);
  }
});

commentvotesRouter.delete("/", async (req, res, next) => {
  const deleteVote = (userId, commentId) => {
    return new Promise((resolve, reject) => {
      const query = `
        DELETE FROM comment_votes
        WHERE user_id = ? AND comment_id = ?
      `;
      console.log(query);
      connection.query(query, [userId, commentId], err => {
        if (err) {
          console.log("unable to remove vote");
          console.log(err);
          return reject(new Error("Unable to delete comment vote"));
        } else {
          console.log("vote removed");
          resolve();
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
    console.log(userId);
    console.log(req.body.commentId);
    deleteVote(userId, req.body.commentId);
  } catch (exception) {
    next(exception);
  }
});

module.exports = commentvotesRouter;
