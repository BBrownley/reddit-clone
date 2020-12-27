const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  password: "",
  user: "root",
  database: "reddit-clone"
});

connection.connect(err => {
  if (err) {
    console.error(`error connecting: ${err.stack}`);
  }
  console.log(`connected as id ${connection.threadId}`);
});

module.exports = { connection };
