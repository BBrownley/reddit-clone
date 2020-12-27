const connection = require("./index");

const all = async () => {
  return new Promise((resolve, reject) => {
    console.log("hey");
    connection.query("SELECT * from posts", (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

module.exports = {
  all
};
