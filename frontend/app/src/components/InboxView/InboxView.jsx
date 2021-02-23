import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import inboxService from "../../services/messages";

export default function InboxView() {
  const [messages, setMessages] = useState([]);

  const user = useSelector(state => state.user);

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await inboxService.getAll();
      console.log(messages);
      setMessages(messages);
    };
    fetchMessages();
  }, []);

  return (
    <div>
      {messages.map(message => (
        <p>{message.content}</p>
      ))}
    </div>
  );
}
