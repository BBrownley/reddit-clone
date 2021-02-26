import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import inboxService from "../../services/messages";

import { setUser } from "../../reducers/userReducer";

import moment from "moment";

import { Message, MessageHeader } from "./InboxView.elements";

export default function InboxView() {
  const [messages, setMessages] = useState([]);

  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  useEffect(() => {
    const fetchMessages = async () => {
      const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
      if (loggedUser) {
        await dispatch(setUser(loggedUser));
      }

      const messages = await inboxService.getAll(user.token);
      setMessages(messages);
    };
    fetchMessages();
  }, []);

  return (
    <div>
      <h1>Messages</h1>
      {messages.map(message => (
        <Message className={!!message.has_read ? ".message-read" : ""}>
          <MessageHeader>
            <p>
              <strong>{message.sender_id ? "user" : "(server message)"}</strong>{" "}
              -{" "}
              {message.subject ? (
                <strong>{message.subject}</strong>
              ) : (
                "no subject"
              )}
            </p>
            <p>
              {moment(message.created_at).format("MMMM Do YYYY, h:mm:ss a")}
            </p>
          </MessageHeader>

          <p>{message.content}</p>
        </Message>
      ))}
    </div>
  );
}
