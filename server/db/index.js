const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  database: "mydb"
});

connection.connect(e => {
  if (e) {
    console.error(`error connecting: ${err.stack}`);
  }
  console.log(`connected as id ${connection.threadId}`);
});

module.exports = { connection };
