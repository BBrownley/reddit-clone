const connection = require("./index").connection;
const jwt = require("jsonwebtoken");

const q = `
  SELECT 
    CASE
      WHEN ISNULL(SUM(post_votes.vote_value)) THEN 0
        WHEN SUM(post_votes.vote_value) < 1 THEN 0
        ELSE SUM(post_votes.vote_value)
    END AS score,
    title, 
    posts.created_at AS createdAt, 
    posts.id AS postID,
    group_name AS groupName,
    group_id AS groupID,
    username,
    users.id AS user_id,
    content FROM posts
  JOIN users ON users.id = posts.submitter_id
  JOIN groups ON groups.id = posts.group_id
  LEFT JOIN post_votes ON post_votes.post_id = posts.id
  GROUP BY posts.id
  ORDER BY posts.created_at DESC
`;

const all = () => {
  console.log("Fetching posts");
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

    // Ensure title and group are filled in, content can be empty
    console.log(data);

    const title = data.title;
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
        submitter_id: decodedToken.id,
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

const getPostsByToken = token => {
  return new Promise(async (resolve, reject) => {
    console.log(`LINE 173 ${token} LINE 173`);

    const decodedToken = jwt.verify(token.split(" ")[1], process.env.SECRET);
    const userId = decodedToken.id;

    console.log(decodedToken);

    connection.query(
      `
    
    SELECT id FROM posts WHERE submitter_id = ?

    `,
      [userId],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        // Return their IDs
        resolve(
          results.reduce((acc, curr) => {
            return [...acc, curr.id];
          }, [])
        );
      }
    );
  });
};

const deletePost = (token, postId) => {
  return new Promise(async (resolve, reject) => {
    const decodedToken = jwt.verify(token.split(" ")[1], process.env.SECRET);
    const submitterId = decodedToken.id;

    connection.query(
      `
    
   DELETE FROM posts WHERE posts.id = ? AND submitter_id = ?

    `,
      [postId, submitterId],
      (err, results) => {
        console.log(JSON.stringify(results));

        if (err) {
          return reject(new Error("An unexpected error has occured"));
        }

        resolve({ message: "Post successfully deleted" });
      }
    );
  });
};

const getPostsByUID = userId => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM posts WHERE submitter_id = ?`,
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

module.exports = {
  all,
  getPostsByToken,
  create,
  vote,
  deletePost,
  getPostsByUID
};
