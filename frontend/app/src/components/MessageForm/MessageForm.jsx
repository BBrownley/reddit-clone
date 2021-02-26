import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import messageService from "../../services/messages";

export default function MessageForm() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const user = useSelector(state => state.user);
  const location = useLocation();

  const sendMessage = () => {
    const message = {
      sender_id: user.userId,
      recipient_id: location.state.recipient_id,
      content: body,
      has_read: 0,
      subject
    };
    messageService.send(message);
  };

  return (
    <div>
      <h1>Write a new message</h1>
      <h3>Subject</h3>
      <input
        type="text"
        value={subject}
        onChange={e => setSubject(e.target.value)}
      />
      <h3>Content</h3>
      <textarea
        name=""
        id=""
        cols="30"
        rows="10"
        value={body}
        onChange={e => setBody(e.target.value)}
      ></textarea>
      <div>
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
