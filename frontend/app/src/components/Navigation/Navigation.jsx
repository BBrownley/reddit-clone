import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { logout } from "../../reducers/userReducer";
import { clearVotes as clearPostVotes } from "../../reducers/userPostVotesReducer";
import { clearVotes as clearCommentVotes } from "../../reducers/commentVotesReducer";
import { clearUserPosts } from "../../reducers/userPostsReducer";
import { clearSubscriptions } from "../../reducers/groupSubscribesReducer";

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

  const hamburgerMenuRef = useRef(null);

  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  const user = useSelector(state => {
    return state.user;
  });

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    dispatch(logout());
    dispatch(clearUserPosts());
    dispatch(clearPostVotes());
    dispatch(clearCommentVotes());
    dispatch(clearSubscriptions());

    const userOnlyRoutes = [
      "/create",
      "/creategroup",
      "/inbox",
      "/messages/compose"
    ];

    if (userOnlyRoutes.find(route => window.location.pathname === route)) {
      history.push("/");
    }

    setHamburgerOpen(false);
  };

  const handleHamburgerMenu = () => {
    setHamburgerOpen(prevState => !prevState);
  };

  useEffect(() => {
    const detectMenuClick = e => {
      if (e.target.matches(".hamburger-menu *")) {
        if (e.target.matches("a") || e.target.matches(".branding-icon")) {
          // User redirected w/ hamburger menu
          setHamburgerOpen(false);
        }
      } else {
        // User clicked outside hamburger menu
        setHamburgerOpen(false);
      }
    };

    window.addEventListener("click", detectMenuClick);
    return () => window.removeEventListener("click", detectMenuClick);
  }, []);

  return (
    <>
      <Container>
        <StyledLink to="/">
          <Branding></Branding>
        </StyledLink>

        <h2>
          <StyledLink to="/groups" className="groups-link">
            Groups
          </StyledLink>
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
      <HamburgerMenu ref={hamburgerMenuRef} className="hamburger-menu">
        <div className="top">
          <div className="container">
            <StyledLink to="/">
              <div className="branding-icon"></div>
            </StyledLink>

            {!!user.userId && (
              <div
                className={`menu-bars ${hamburgerOpen ? "open" : ""}`}
                onClick={() => handleHamburgerMenu()}
              >
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
              </div>
            )}
            {!user.userId && (
              <nav className="mini-nav">
                <ul>
                  <li>
                    <StyledLink to="/groups">Groups</StyledLink>
                  </li>
                  <li>
                    <StyledLink to="/login">Log in</StyledLink>
                  </li>
                  <li>
                    <StyledLink to="/register">Register</StyledLink>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
        <nav className={`menu ${hamburgerOpen ? "open" : ""}`}>
          <ul>
            <li>
              <StyledLink to="/">Home</StyledLink>
            </li>
            <li>
              <StyledLink to="/groups">Groups</StyledLink>
            </li>
            <li>
              <StyledLink to={`/users/${user.userId}`}>My Profile</StyledLink>
            </li>
            <li>
              <StyledLink to="/inbox">Inbox</StyledLink>
            </li>
            <li>
              <StyledLink onClick={handleLogout}>Logout</StyledLink>
            </li>
          </ul>
        </nav>
      </HamburgerMenu>
    </>
  );
}
