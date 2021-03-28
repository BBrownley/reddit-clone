import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import {FormContainer, FormHeader, FormField} from "../shared/Form.elements";

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
    <FormContainer>
      <FormHeader>Write a new message</FormHeader>
      <form id="message-form" onSubmit={sendMessage}>
        <FormField>
          <label htmlFor="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={subject}
            onChange={e => setSubject(e.target.value)}
          ></input>
        </FormField>
        <FormField>
          <label htmlFor="email">Message:</label>
          <textarea
            type="message"
            id="message"
            name="message"
            value={body}
            onChange={e => setBody(e.target.value)}
          ></textarea>
        </FormField>
      </form>
      <button type="submit" form="register-form">
        Send
      </button>
      {/* <Notification /> */}
    </FormContainer>
  );

}
