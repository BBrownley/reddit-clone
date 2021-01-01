const connection = require("./index").connection;

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

const create = data => {
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO posts SET ? `,
      {
        submitter_id: 1,
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
