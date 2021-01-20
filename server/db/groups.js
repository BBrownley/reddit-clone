const connection = require("./index").connection;

const q = `
  SELECT 
    group_name AS groupName,
    created_at AS createdAt,
    id
  FROM groups
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

const getGroupByName = groupName => {
  return new Promise((resolve, reject) => {
    connection.query(
      `
      SELECT * FROM groups
      WHERE group_name = ?
      LIMIT 1
    `,
      [groupName],
      (err, results) => {
        if (err) {
          return reject(new Error("An unexpected error has occured"));
        }
        resolve(results[0]);
      }
    );
  });
};

module.exports = {
  all,
  getGroupByName
};
