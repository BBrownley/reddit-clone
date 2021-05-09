import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { logout } from "../../reducers/userReducer";
import { clearVotes as clearPostVotes } from "../../reducers/userPostVotesReducer";
import { clearVotes as clearCommentVotes } from "../../reducers/commentVotesReducer";

import UserCard from "../UserCard/UserCard";

import { Navigation as Container, Branding } from "./Navigation.elements";
import StyledLink from "../shared/NavLink.elements";

export default function Navigation() {
  const dispatch = useDispatch();
  const history = useHistory();

  const user = useSelector(state => {
    return state.user;
  });

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    dispatch(logout());
    dispatch(clearPostVotes());
    dispatch(clearCommentVotes());

    const userOnlyRoutes = [
      "/create",
      "/creategroup",
      "/inbox",
      "/messages/compose"
    ];

    if (userOnlyRoutes.find(route => window.location.pathname === route)) {
      history.push("/");
    }
  };

  return (
    <Container>
      <StyledLink to="/">
        <Branding>Hello! ^_^</Branding>
      </StyledLink>

      <div>
        <h2>
          <StyledLink to="/groups">Groups</StyledLink>
        </h2>
        {(() => {
          if (user.username) {
            return (
              <UserCard username={user.username} handleLogout={handleLogout} />
            );
          } else {
            return (
              <ul>
                <li>
                  <StyledLink to="/login">Log in</StyledLink>
                </li>
                <li>
                  <StyledLink to="/register">Register</StyledLink>
                </li>
              </ul>
            );
          }
        })()}
      </div>
    </Container>
  );
}
