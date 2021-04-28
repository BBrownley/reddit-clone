// const postVotesRouter = require("express").Router();
// const jwt = require("jwt");

// const connection = require("../db/index").connection;

// postVotesRouter.delete("/:id", (req, res, next) => {
//   const deletePostVote = (postId, userId) => {
//     return new Promise((resolve, reject) => {
//       const query = `
//         DELETE FROM post_votes
//         WHERE post_id = ? AND user_id = ?
//       `
//       connection.query(query, [postId, userId], (err, results) => {
//         if (err) {
//           reject(new Error("Unable to remove user post vote"));
//         } else {
//           resolve();
//         }
//       });
//     })
//   }
//   try {
//     const userToken = req.headers.authorization.split(" ")[1];
//     const decodedToken = jwt.verify(userToken, process.env.SECRET);
//     await deletePostVote(req.params.id, decodedToken.id)
//   } catch (exception) {
//     next(exception);
//   }
// });