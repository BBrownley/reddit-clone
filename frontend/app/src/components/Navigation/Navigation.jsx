import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../../reducers/userReducer";

import UserCard from "../UserCard/UserCard";

import { Navigation as Container, Branding } from "./Navigation.elements";
import StyledLink from "../shared/NavLink.elements";

export default function Navigation() {
  const dispatch = useDispatch();

  const user = useSelector(state => {
    return state.user;
  });

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    dispatch(logout());
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
