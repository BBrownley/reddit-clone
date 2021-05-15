import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { logout } from "../../reducers/userReducer";
import { clearVotes as clearPostVotes } from "../../reducers/userPostVotesReducer";
import { clearVotes as clearCommentVotes } from "../../reducers/commentVotesReducer";

import UserCard from "../UserCard/UserCard";

import {
  Navigation as Container,
  Branding,
  HamburgerMenu
} from "./Navigation.elements";
import StyledLink from "../shared/NavLink.elements";

import FontAwesome from "react-fontawesome";

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
    <>
      <Container>
        <StyledLink to="/">
          <Branding></Branding>
        </StyledLink>

        <h2>
          <StyledLink to="/groups" className="groups-link">Groups</StyledLink>
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
      </Container>
      <HamburgerMenu>
        <div className="container">
          <StyledLink to="/">
            <div className="branding-icon"></div>
          </StyledLink>

          <div>
            <FontAwesome name="bars" className="fa-bars"></FontAwesome>
          </div>
        </div>
      </HamburgerMenu>
    </>
  );
}
