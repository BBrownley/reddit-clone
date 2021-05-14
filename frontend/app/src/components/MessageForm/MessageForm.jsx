import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";

import {
  setNotification,
  removeNotification
} from "../../reducers/notificationReducer";

import FormWarning from "../FormWarning/FormWarning";

import { FormContainer, FormHeader, FormField } from "../shared/Form.elements";

import messageService from "../../services/messages";

export default function MessageForm() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const user = useSelector(state => state.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();

  const sendMessage = e => {
    e.preventDefault();
    if (!validateForm()) return;

    const message = {
      sender_id: user.userId,
      recipient_id: location.state.recipient_id,
      content: body,
      has_read: 0,
      subject
    };
    messageService.send(message);
    history.goBack();
  };

  const validateForm = () => {
    // Check that all fields are filled in
    if (subject.trim().length === 0 || body.trim().length === 0) {
      dispatch(setNotification("All fields must be filled in"));
      return false;
    }
    return true;
  };

  // Clear form error on user input, route change
  useEffect(() => {
    return () => {
      dispatch(removeNotification());
    };
  }, [dispatch, subject, body]);

  useEffect(() => {
    if (user.userId === null) {
      history.push("/");
    }
  });

  return (
    <FormContainer>
      <FormHeader>Write a new message</FormHeader>
      <form id="message-form" onSubmit={e => sendMessage(e)}>
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
      <button type="submit" form="message-form">
        Send
      </button>
      <FormWarning />
    </FormContainer>
  );
}
