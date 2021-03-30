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
        ORDER BY created_at DESC
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

messageRouter.post("/followers/:postId", async (req, res, next) => {
  const notifyFollowers = message => {
    return new Promise((resolve, reject) => {
      // Get all followers of the post
      const query = `
        SELECT user_id FROM post_follows
        WHERE post_id = ?
      `;
      connection.query(query, [req.params.postId], (err, results) => {
        if (err) {
          reject(new Error("Unable to send message"));
        } else {
          const userIds = results.reduce((acc, curr) => {
            return [...acc, curr.user_id];
          }, []);
          // Send messages to followers

          const query = `
            INSERT INTO messages SET ?
          `;

          const messageValues = userIds.map(uid => {
            return {
              sender_id: null,
              recipient_id: uid,
              content: message.content,
              has_read: 0,
              subject: null
            };
          });

          console.log(messageValues);

          connection.query(query, [...messageValues], (err, results) => {
            if (err) {
              reject(new Error(err.message));
            }
            resolve("done");
          });
        }
      });
    });
  };
  try {
    console.log(req.body.message);
    await notifyFollowers(req.body.message);
  } catch (exception) {
    next(exception);
  }
});

messageRouter.put("/", async (req, res, next) => {
  const setMessageRead = messageId => {
    return new Promise((resolve, reject) => {
      const query = `
      UPDATE messages
      SET has_read = "Y"
      WHERE messages.id = ?
    `;
      connection.query(query, [messageId], (err, results) => {
        if (err) {
          reject(new Error("Unable to set read status on message"));
        } else {
          resolve({ message: "Message set as read" });
        }
      });
    });
  };

  try {
    const success = setMessageRead(req.body.id);
    res.json(success);
  } catch (exception) {
    next(exception);
  }
});

module.exports = messageRouter;
