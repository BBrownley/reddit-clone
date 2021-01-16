const connection = require("./index").connection;
const jwt = require("jsonwebtoken");

const q = `
  SELECT post_id, SUM(vote_value) AS score FROM post_votes
  WHERE post_id = ?
  GROUP BY post_id
`;

const getPostScore = postID => {
  return new Promise((resolve, reject) => {
    connection.query(q, [postID], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

const getUserPostVotes = token => {
  return new Promise((resolve, reject) => {
    console.log(`The token value is: ${token}`);

    if (token === null) {
      return reject(new Error("No JWT provided - cannot load user post votes"));
    }

    const decodedToken = jwt.verify(token.split(" ")[1], process.env.SECRET);
    const userId = decodedToken.id;

    connection.query(
      `
      SELECT post_id, vote_value FROM post_votes
      WHERE user_id = ?
    `,
      [userId],
      (err, results) => {
        if (err) {
          return reject(new Error("An unexpected error has occured"));
        } else {
          resolve(results);
        }
      }
    );
  });
};

module.exports = {
  getPostScore,
  getUserPostVotes
};
