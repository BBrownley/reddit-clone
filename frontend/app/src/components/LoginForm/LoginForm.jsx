import React, { useState } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FormContainer, FormHeader, FormField } from "../shared/Form.elements";

import { login } from "../../reducers/userReducer";
import { initializeVotes } from "../../reducers/userPostVotesReducer";
import {
  setNotification,
  timedNotification
} from "../../reducers/notificationReducer";

import Notification from "../../components/Notification/Notification";

import userService from "../../services/users";

const LoginForm = props => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const history = useHistory();
  const location = useLocation();

  const user = useSelector(state => state.user);

  const handleSetUsername = e => {
    setUsername(e.target.value);
  };

  const handleSetPassword = e => {
    setPassword(e.target.value);
  };

  console.log(location);

  const handleLogin = async e => {
    e.preventDefault();
    const data = { username, password };

    const loginSuccess = await dispatch(login(data));

    console.log(loginSuccess);

    if (loginSuccess) {
      dispatch(initializeVotes());
      localStorage.setItem("loggedUser", JSON.stringify(loginSuccess));
      history.push(`/`);
    }
  };

  let headerMessage;
  let creatingPost; // Did the user end up here from attempting to make a new post while not logged in?

  // TODO: Make this more concise!
  try {
    headerMessage = location.state.headerMessage;
    creatingPost = location.state.creatingPost;
  } catch (e) {
    headerMessage = "Login";
    creatingPost = false;
  }

  return (
    <FormContainer>
      <FormHeader>{headerMessage}</FormHeader>
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

      {/* <Link to={{
      pathname: '/template',
      search: '?query=abc',
      state: { detail: response.data }
    }}> My Link </Link> */}

      <p>
        New user? Register{" "}
        <Link
          to={{
            pathname: "/register",
            state: { creatingPost }
          }}
        >
          here
        </Link>
        .
      </p>

      <button type="submit" form="login-form">
        Login
      </button>
      <Notification />
    </FormContainer>
  );
};

export default LoginForm;
