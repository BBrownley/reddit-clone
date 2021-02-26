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

messageRouter.post("/", async (req, res, next) => {
  const sendMessage = message => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO messages SET ?
      `;

      console.log(message);

      connection.query(
        query,
        {
          sender_id: message.sender_id,
          recipient_id: message.recipient_id,
          content: message.content,
          has_read: 0,
          subject: message.subject
        },
        (err, results) => {
          if (err) {
            reject(new Error("Unable to send message"));
          } else {
            resolve("Message sent");
          }
        }
      );
    });
  };

  try {
    const message = await sendMessage(req.body);
    res.json(message);
  } catch (exception) {
    next(exception);
  }
});

module.exports = messageRouter;
