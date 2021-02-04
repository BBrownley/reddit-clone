import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import { login, register } from "../../reducers/userReducer";
import { removeNotification } from "../../reducers/notificationReducer";

import Notification from "../../components/Notification/Notification";

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

  // TODO: Make this more concise!
  let creatingPost;

  try {
    creatingPost = location.state.creatingPost;
  } catch (e) {
    creatingPost = false;
  }

  const handleRegistration = async e => {
    e.preventDefault();
    const data = { username, email, password, confirmPassword };

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
      <button type="submit" form="register-form">
        Register
      </button>
      <Notification />
    </FormContainer>
  );
};

export default RegisterForm;
