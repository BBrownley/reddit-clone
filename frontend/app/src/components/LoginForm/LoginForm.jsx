import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FormContainer, FormHeader, FormField } from "../shared/Form.elements";

import { login } from "../../reducers/userReducer";
import { initializeVotes } from "../../reducers/userPostVotesReducer";

import postService from "../../services/posts";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const history = useHistory();

  const user = useSelector(state => state.user);

  const handleSetUsername = e => {
    setUsername(e.target.value);
  };

  const handleSetPassword = e => {
    setPassword(e.target.value);
  };

  const handleLogin = async e => {
    e.preventDefault();
    const data = { username, password };
    console.log(data);
    await dispatch(login(data));

    dispatch(initializeVotes()); 

    history.push(`/`);
  };

  return (
    <FormContainer>
      <FormHeader>Login</FormHeader>
      <form id="login-form" onSubmit={handleLogin}>
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
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleSetPassword}
          ></input>
        </FormField>
      </form>
      <button type="submit" form="login-form">
        Login
      </button>
    </FormContainer>
  );
};

export default LoginForm;
