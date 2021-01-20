const connection = require("./index").connection;
const jwt = require("jsonwebtoken");

const q = `
  SELECT 
    group_name,
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

const create = (data, token) => {
  return new Promise((resolve, reject) => {
    console.log({ data, token });

    // Verify user
    const decodedToken = jwt.verify(token.split(" ")[1], process.env.SECRET);

    // Check if group already exists by name
    connection.query(
      `
      SELECT * FROM groups WHERE group_name = ?
    `,
      [data.groupName],
      (err, results) => {
        if (err) {
          console.log("hey");
          reject(new Error("An unexpected error has occured"));
        }
        if (results.length > 0) {
          reject(new Error("Group name already exists"));
        }
      }
    );

    connection.query(
      `
      INSERT INTO groups SET ?
    `,
      {
        group_name: data.groupName,
        blurb: data.blurb,
        owner_id: decodedToken.id
      },
      (err, results) => {
        console.log(results);
        if (err) {
          console.log(err);
          return reject(new Error("An unexpected error has occured"));
        } else {
          connection.query(
            `SELECT * FROM groups WHERE id = ?`,
            [results.insertId],
            (err, results) => {
              if (err) {
                return reject(new Error("An unexpected error has occured"));
              }

              console.log(`RESULTS FROM GROUP DB: ${results[0]}`);
              resolve(results[0]);
            }
          );
        }
      }
    );
  });
};

module.exports = {
  all,
  getGroupByName,
  create
};
