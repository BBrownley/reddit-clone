const connection = require("./index").connection;
const jwt = require("jsonwebtoken");

const q = `
  SELECT 
    CASE
      WHEN ISNULL(SUM(post_votes.vote_value)) THEN 1
        WHEN SUM(post_votes.vote_value) < 1 THEN 0
        ELSE SUM(post_votes.vote_value) + 1
    END AS score,
    title, 
    posts.created_at AS createdAt, 
    posts.id AS postID,
    group_name AS groupName,
    group_id AS groupID,
    username,
    content FROM posts
  JOIN users ON users.id = posts.submitter_id
  JOIN groups ON groups.id = posts.group_id
  LEFT JOIN post_votes ON post_votes.post_id = posts.id
  GROUP BY posts.id
  ORDER BY posts.created_at DESC
`;

const all = () => {
  return new Promise((resolve, reject) => {
    connection.query(q, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

const create = (data, token) => {
  return new Promise((resolve, reject) => {
    // Verify user
    const decodedToken = jwt.verify(token.split(" ")[1], process.env.SECRET);

    connection.query(
      `INSERT INTO posts SET ? `,
      {
        submitter_id: decodedToken.id,
        group_id: data.groupID,
        title: data.title,
        content: data.content
      },
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          // Retrieve created object
          connection.query(
            ` SELECT 
                title, 
                posts.created_at AS createdAt, 
                posts.id AS postID,
                group_name AS groupName,
                group_id AS groupID,
                username,
                content FROM posts
              JOIN users ON users.id = posts.submitter_id
              JOIN groups ON groups.id = posts.group_id
              WHERE posts.id = ?`,
            [results.insertId],
            (err, results) => {
              if (err) {
                reject(err);
              } else {
                resolve(results);
              }
            }
          );
        }
      }
    );
  });
};

const vote = (data, postID, token) => {
  return new Promise((resolve, reject) => {
    //console.log(data);
    // Verify user
    const decodedToken = jwt.verify(token.split(" ")[1], process.env.SECRET);
    console.log({
      user_id: decodedToken.id,
      post_id: postID,
      value: data.value
    });
    // Check to see if user already voted or not

    connection.query(
      `SELECT * FROM post_votes WHERE user_id = ? AND post_id = ?`,
      [decodedToken.id, postID],
      (err, results) => {
        if (results.length !== 0) {
          const prevVoteValue = results[0].vote_value;

          console.log(`Previous vote value: ${prevVoteValue}`);
          console.log(`Passed in vote value: ${data.value}`);

          // Two cases:

          if (prevVoteValue === data.value) {
            // 1) prevVoteValue === data.value => Just remove the vote
            connection.query(
              `DELETE FROM post_votes WHERE user_id = ? AND post_id = ?`,
              [decodedToken.id, postID],
              (err, results) => {
                console.log(`Vote object: ${results[0]}`);
                resolve({ ...data, hasVoted: true, prevVoteValue });
              }
            );
          } else if (prevVoteValue !== data.value) {
            // 2) prevVoteValue === data.value => Alter the vote
            connection.query(
              `
                UPDATE post_votes
                SET 
                  vote_value = ?
                WHERE user_id = ? AND post_id = ?  
              `,
              [data.value, decodedToken.id, postID],
              (err, results) => {
                console.log(`Vote object: ${results[0]}`);
                resolve({ ...data, hasVoted: true, prevVoteValue });
              }
            );
          }
        } else {
          // Add the vote
          connection.query(
            `INSERT INTO post_votes SET ? `,
            {
              user_id: decodedToken.id,
              post_id: postID,
              vote_value: data.value
            },
            (err, results) => {
              if (err) {
                reject(err);
              } else {
                resolve(results);
              }
            }
          );
        }
      }
    );
  });
};

module.exports = {
  all,
  create,
  vote
};
