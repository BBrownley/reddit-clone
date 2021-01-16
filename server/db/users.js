const connection = require("./index").connection;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = userInfo => {
  return new Promise(async (resolve, reject) => {
    const username = userInfo.username;
    const email = userInfo.email;
    const password = userInfo.password;
    const confirmPassword = userInfo.confirmPassword;

    console.log(userInfo);

    // Check to make sure all fields were filled in

    if (!username || !email || !password || !confirmPassword) {
      return reject(new Error("All fields must be filled in"));
    }
    // Validate confirm password
    if (password !== confirmPassword) {
      return reject(new Error("Passwords do not match"));
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
          return reject(new Error("Username already in use"));
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
          return reject(new Error("Email already in use"));
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

const login = userInfo => {
  return new Promise((resolve, reject) => {
    const username = userInfo.username;
    const password = userInfo.password;

    // Check to make sure all fields were filled in

    if (!username || !password) {
      return reject(new Error("All fields must be filled in"));
    }

    // Compare hashed password with given password to see if it matches
    connection.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
      async (error, results) => {
        try {
          const comparePW = await bcrypt.compare(
            password,
            results[0].hashed_password
          );

          if (comparePW) {
            console.log("Login succeeded");

            const userInfo = { username, id: results[0].id };
            const token = jwt.sign(userInfo, process.env.SECRET);

            resolve({ username, token });
          } else {
            return reject(new Error("Invalid username or password"));
          }
        } catch (exception) {
          return reject(new Error("Invalid username or password"));
        }
      }
    );
  });
};

module.exports = {
  register,
  login
};
