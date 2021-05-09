const connection = require("./index").connection;

const q = `
  SELECT 
  CASE
    WHEN ISNULL(SUM(post_votes.vote_value)) THEN 0
      WHEN SUM(post_votes.vote_value) < 1 THEN 0
      ELSE SUM(post_votes.vote_value)
  END AS score,
  title, 
  posts.created_at AS created_at, 
  posts.id AS postID,
  group_name AS groupName,
  group_id AS groupID,
  username,
  users.id AS user_id,
  content,
  (SELECT COUNT(*) FROM post_follows WHERE posts.id = post_follows.post_id) AS follows,
  (SELECT COUNT(*) FROM comments 
    WHERE posts.id = comments.post_id) AS total_comments
  FROM posts
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

const create = (data, userId) => {
  return new Promise((resolve, reject) => {
    // Ensure title and group are filled in, content can be empty

    const title = data.title.trim();
    const groupID = data.groupID;

    if (!title) {
      return reject(new Error("Post must contain a title"));
    }

    if (!groupID) {
      return reject(new Error("Post must be assigned to a group"));
    }

    connection.query(
      `INSERT INTO posts SET ? `,
      {
        submitter_id: userId,
        group_id: data.groupID,
        title: data.title,
        content: data.content
      },
      (err, results) => {
        if (err) {
          return reject(new Error("An unexpected error has occured"));
        } else {
          // Retrieve created object
          connection.query(
            ` SELECT 
                title, 
                posts.created_at AS created_at, 
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
              console.log(results[0]);
              if (err) {
                return reject(new Error("An unexpected error has occured"));
              } else {
                resolve(results[0]);
              }
            }
          );
        }
      }
    );
  });
};

const vote = (data, postID, userId) => {
  return new Promise((resolve, reject) => {
    // Check to see if user already voted or not
    connection.query(
      `SELECT * FROM post_votes WHERE user_id = ? AND post_id = ?`,
      [userId, postID],
      (err, results) => {
        if (err) {
          reject(new Error("Unable to vote on post"));
        }

        if (results.length !== 0) {
          const prevVoteValue = results[0].vote_value;

          // Two cases:

          if (prevVoteValue === data.value) {
            // 1) prevVoteValue === data.value => Just remove the vote
            connection.query(
              `DELETE FROM post_votes WHERE user_id = ? AND post_id = ?`,
              [userId, postID],
              (err, results) => {
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
              [data.value, userId, postID],
              (err, results) => {
                resolve({ ...data, hasVoted: true, prevVoteValue });
              }
            );
          }
        } else {
          // Add the vote
          connection.query(
            `INSERT INTO post_votes SET ? `,
            {
              user_id: userId,
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

const getPostsByUserId = userId => {
  return new Promise(async (resolve, reject) => {
    const query = `SELECT id FROM posts WHERE submitter_id = ?`;

    connection.query(query, [userId], (err, results) => {
      if (err) {
        return reject(err);
      }
      // Return their IDs
      resolve(
        results.reduce((acc, curr) => {
          return [...acc, curr.id];
        }, [])
      );
    });
  });
};

const deletePost = (userId, postId) => {
  return new Promise(async (resolve, reject) => {
    const query = `DELETE FROM posts WHERE posts.id = ? AND submitter_id = ?`;
    connection.query(query, [postId, userId], (err, results) => {
      if (err) {
        return reject(new Error("An unexpected error has occured"));
      }

      resolve({ message: "Post successfully deleted" });
    });
  });
};

const getPostsByUID = userId => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT 
      CASE
        WHEN ISNULL(SUM(post_votes.vote_value)) THEN 0
          WHEN SUM(post_votes.vote_value) < 1 THEN 0
          ELSE SUM(post_votes.vote_value)
      END AS score,
      title, 
      posts.created_at AS created_at, 
      posts.id AS postID,
      group_name AS groupName,
      group_id AS groupID,
      username,
      users.id AS user_id,
      content FROM posts
    JOIN users ON users.id = posts.submitter_id
    JOIN groups ON groups.id = posts.group_id
    LEFT JOIN post_votes ON post_votes.post_id = posts.id
    WHERE posts.submitter_id = ?
    GROUP BY posts.id
    ORDER BY posts.created_at DESC
    `,
      [userId],
      (error, results) => {
        if (error) {
          reject(new Error("Unable to fetch user posts"));
        } else {
          resolve(results);
        }
      }
    );
  });
};

const getPostFollowsByUserId = userId => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM post_follows
      WHERE user_id = ?
    `;

    connection.query(query, [userId], (err, results) => {
      if (err) {
        reject(new Error(err.message));
      } else {
        const postIds = results.reduce((ids, curr) => {
          ids.push(curr.post_id);
          return ids;
        }, []);
        resolve(postIds);
      }
    });
  });
};

module.exports = {
  all,
  getPostsByUserId,
  create,
  vote,
  deletePost,
  getPostsByUID,
  getPostFollowsByUserId,
  connection
};
