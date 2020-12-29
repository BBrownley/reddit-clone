const connection = require("./index").connection;

const q = `
  SELECT 
    title, 
    posts.created_at AS createdAt, 
    group_name AS groupName,
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

module.exports = {
  all
};
