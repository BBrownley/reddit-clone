const mysql = require("mysql");
const connection = mysql.createPool({
  connectionLimit: 1000,
  host: "localhost",
  password: "",
  user: "root",
  database: "reddit-clone"
});

// connection.pool.connect(err => {
//   if (err) {
//     console.error(`error connecting: ${err.stack}`);
//   }
//   console.log(`connected as id ${connection.threadId}`);
// });

module.exports = { connection };
