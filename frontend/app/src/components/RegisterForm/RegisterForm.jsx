import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import { login, register } from "../../reducers/userReducer";
import {
  removeNotification,
  setNotification
} from "../../reducers/notificationReducer";

import FormWarning from "../FormWarning/FormWarning";

import { FormContainer, FormHeader, FormField } from "../shared/Form.elements";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();

  const history = useHistory();
  const location = useLocation();

  // Clear notification on component unmount/view change
  useEffect(() => {
    return () => dispatch(removeNotification());
  }, [dispatch]);

  // Clear notification on form input
  useEffect(() => {
    dispatch(removeNotification());
  }, [username, email, password, confirmPassword]);

  const handleSetUsername = e => {
    setUsername(e.target.value);
  };

  const handleSetEmail = e => {
    setEmail(e.target.value);
  };

  const handleSetPassword = e => {
    setPassword(e.target.value);
  };

  const handleSetConfirmPassword = e => {
    setConfirmPassword(e.target.value);
  };

  let creatingPost;

  try {
    creatingPost = location.state.creatingPost;
  } catch (e) {
    creatingPost = false;
  }

  const validateRegistration = data => {
    // All fields must be filled in

    const formValues = Object.values(data);

    for (let i = 0; i < formValues.length; i++) {
      if (formValues[i].trim().length === 0) {
        dispatch(setNotification("All fields must be filled in"));
        return false;
      }
    }

    // Passwords must match
    if (data.password !== data.confirmPassword) {
      dispatch(setNotification("Passwords do not match"));
      return false;
    }
    // E-mail must be valid
    const mailformat = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const emailValid = data.email.match(mailformat);

    if (!emailValid) {
      dispatch(setNotification("E-mail must be valid"));
      return false;
    }

    // Alphanumeric usernames only
    const alphanumeric = /^[a-z0-9]+$/i;
    if (!alphanumeric.test(data.username)) {
      dispatch(
        setNotification("Username must contain alphanumeric characters only")
      );
      return false;
    }

    // Username must be 20 chars or less
    if (username.trim().length > 20) {
      dispatch(setNotification("Username must be 20 characters or less"));
      return false;
    }

    // Validation passes
    return true;
  };

  const handleRegistration = async e => {
    e.preventDefault();
    const data = { username, email, password, confirmPassword };

    // Front end validation
    if (!validateRegistration(data)) return;

    const success = await dispatch(register({ data }));

    if (success) {
      // If account creation successful, automatically log them in
      dispatch(login({ username: data.username, password: data.password }));
      if (creatingPost) {
        history.push("/create");
      } else {
        history.push(`/`);
      }
    }
  };

  return (
    <FormContainer>
      <FormHeader>Register</FormHeader>
      <form id="register-form" onSubmit={handleRegistration}>
        <FormField>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleSetUsername}
          ></input>
        </FormField>
        <FormField>
          <label htmlFor="email">Email address:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleSetEmail}
          ></input>
        </FormField>
        <FormField>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleSetPassword}
          ></input>
        </FormField>
        <FormField>
          <label htmlFor="confirm-password">Confirm password:</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            value={confirmPassword}
            onChange={handleSetConfirmPassword}
          ></input>
        </FormField>
      </form>
      <button type="submit" form="register-form" className="primary">
        Register
      </button>
      <FormWarning />
    </FormContainer>
  );
};

export default RegisterForm;
