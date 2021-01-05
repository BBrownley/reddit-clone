const connection = require("./index").connection;
const jwt = require("jsonwebtoken");

const q = `
  SELECT 
    title, 
    posts.created_at AS createdAt, 
    posts.id AS postID,
    group_name AS groupName,
    group_id AS groupID,
    username,
    content FROM posts
  JOIN users ON users.id = posts.submitter_id
  JOIN groups ON groups.id = posts.group_id
`;

const all = () => {
  return new Promise((resolve, reject) => {
    connection.query(q, (err, results) => {
      if (err) {
        return reject(err);
      }
      console.log(results);
      resolve(results);
    });
  });
};

const create = (data, token) => {
  return new Promise((resolve, reject) => {
    console.log(data);
    console.log(token.split(" ")[1]);

    // Verify user
    const decodedToken = jwt.verify(token.split(" ")[1], process.env.SECRET);
    console.log(decodedToken);

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

module.exports = {
  all,
  create
};
