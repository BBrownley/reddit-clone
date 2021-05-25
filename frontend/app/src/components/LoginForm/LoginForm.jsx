import React, { useState, useEffect } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FormContainer, FormHeader, FormField } from "../shared/Form.elements";

import { login } from "../../reducers/userReducer";
import { initializeVotes as initializePostVotes } from "../../reducers/userPostVotesReducer";
import { initializeSubscriptions } from "../../reducers/groupSubscribesReducer";
import { clearRedirectPath } from "../../reducers/redirectReducer";
import { removeNotification } from "../../reducers/notificationReducer";
import { initializeUserPosts } from "../../reducers/userPostsReducer";
import { setUser, initializeFollows } from "../../reducers/userReducer";

import FormWarning from "../FormWarning/FormWarning";

const LoginForm = props => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const redirectPath = useSelector(state => state.redirectPath);

  const history = useHistory();
  const location = useLocation();

  const handleSetUsername = e => {
    setUsername(e.target.value);
  };

  const handleSetPassword = e => {
    setPassword(e.target.value);
  };

  // Clear notification, redirect path on component unmount/view change
  useEffect(() => {
    return () => {
      dispatch(removeNotification());
      dispatch(clearRedirectPath());
    };
  }, [dispatch]);

  const handleLogin = async e => {
    e.preventDefault();
    const credentials = { username, password };

    const loginSuccess = await dispatch(login(credentials));

    if (loginSuccess) {
      dispatch(initializeFollows());
      dispatch(initializePostVotes());
      dispatch(initializeSubscriptions());
      dispatch(initializeUserPosts(loginSuccess.userId));
      localStorage.setItem("loggedUser", JSON.stringify(loginSuccess));
      if (redirectPath) {
        history.push(redirectPath);
      } else {
        history.push(`/`);
      }
    }
  };

  let headerMessage = location.state?.headerMessage || "Login";
  let creatingPost = location.state?.creatingPost || false; // Did the user end up here from attempting to make a new post while not logged in?

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
      <FormWarning />
    </FormContainer>
  );
};

export default LoginForm;
