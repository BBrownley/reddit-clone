import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import inboxService from "../../services/messages";

import { setUser } from "../../reducers/userReducer";

import moment from "moment";

import MessageView from "../MessageView/MessageView";

import { Message, MessageHeader } from "./InboxView.elements";
import ButtonGroup from "../shared/ButtonGroup.elements";
import messageService from "../../services/messages";

export default function InboxView() {
  const [messages, setMessages] = useState([]);
  const [messageFilter, setMessageFilter] = useState("unread");

  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const history = useHistory();

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

  const openMessage = message => {
    history.push({
      pathname: "/inbox/message",
      state: {
        subject: message.subject,
        sender: message.sender_id,
        time: message.created_at,
        body: message.content,
        id: message.id
      }
    });
    messageService.setRead(message.id);
  };

  const filterMessages = messages => {
    switch (messageFilter) {
      case "all":
        return messages;
      case "server":
        return messages.filter(message => message.sender_id === null);
      case "direct":
        return messages.filter(message => message.sender_id !== null);
      case "unread":
        return messages.filter(message => message.has_read === "N");
    }
  };

  return (
    <div>
      <h1>Messages</h1>
      <ButtonGroup>
        <li
          className={messageFilter === "unread" ? "active" : ""}
          onClick={() => setMessageFilter("unread")}
        >
          Unread
        </li>
        <li
          className={messageFilter === "all" ? "active" : ""}
          onClick={() => setMessageFilter("all")}
        >
          All
        </li>

        <li
          className={messageFilter === "server" ? "active" : ""}
          onClick={() => setMessageFilter("server")}
        >
          Server
        </li>
        <li
          className={messageFilter === "direct" ? "active" : ""}
          onClick={() => setMessageFilter("direct")}
        >
          Direct Messages
        </li>
      </ButtonGroup>
      {messages.length === 0 && <h3>Inbox empty</h3>}
      {filterMessages(messages).map(message => (
        <Message
          className={message.has_read === "Y" ? ".message-read" : ""}
          onClick={() => openMessage(message)}
        >
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
