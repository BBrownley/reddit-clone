const connection = require("./index").connection;

const q = `
  SELECT 
    group_name AS groupName,
    created_at AS createdAt
  FROM groups
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
