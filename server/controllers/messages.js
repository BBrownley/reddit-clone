const messageRouter = require("express").Router();
const connection = require("../db/index").connection;
const jwt = require("jsonwebtoken");

messageRouter.get("/", async (req, res, next) => {
  const token = req.headers.authorization;
  const decodedToken = jwt.verify(token.split(" ")[1], process.env.SECRET);
  const getMessages = () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM messages
        WHERE recipient_id = ?
      `;
      connection.query(query, [decodedToken.id], (err, results) => {
        if (err) {
          reject(new Error("Unable to fetch messages from server"));
        } else {
          resolve(results);
        }
      });
    });
  };
  try {
    const messages = await getMessages();
    console.log(messages);
    res.json(messages);
  } catch (exception) {
    next(exception);
  }
});

module.exports = messageRouter;
