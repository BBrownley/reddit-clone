const connection = require("./index").connection;
const bcrypt = require("bcrypt");

const register = userInfo => {
  return new Promise(async (resolve, reject) => {
    const username = userInfo.username;
    const email = userInfo.email;
    const password = userInfo.password;
    const confirmPassword = userInfo.confirmPassword;

    // Check to make sure all fields were filled in

    if (!username || !email || !password || !confirmPassword) {
      return reject({
        error: "All fields must be filled in"
      });
    }
    // Validate confirm password
    if (password !== confirmPassword) {
      return reject({
        error: "Passwords do not match"
      });
    }
    // Check to make sure username or email isn't in use
    connection.query(
      `SELECT username FROM users WHERE username = ?`,
      [username],
      async (error, results) => {
        if (error) {
          console.log(error);
        }
        if (results.length > 0) {
          reject({ error: "Username already in use" });
        }
      }
    );

    connection.query(
      `SELECT email FROM users WHERE email = ?`,
      [email],
      async (error, results) => {
        if (error) {
          console.log(error);
        }
        if (results.length > 0) {
          reject({ error: "Email already in use" });
        }
      }
    );
    // User validation succeeds, hash password and store results in DB
    const hashed_password = await bcrypt.hash(password, 8);

    connection.query(
      `INSERT INTO users SET ? `,
      { username, hashed_password, email },
      (error, results) => {
        if (error) {
          console.log(error);
        } else {
          console.log("User registered");
          console.log(results);
          resolve(results);
        }
      }
    );
  });
};

module.exports = {
  register
};
