import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import styled from "styled-components";

import { initializePosts } from "./reducers/postsReducer";
import { initializeGroups } from "./reducers/groupsReducer";
import { initializeVotes as initializePostVotes } from "./reducers/userPostVotesReducer";
import { initializeVotes as initializeCommentVotes } from "./reducers/commentVotesReducer";
import { logout, setUser, initializeFollows } from "./reducers/userReducer";
import { initializeSubscriptions } from "./reducers/groupSubscribesReducer";

import GroupInfo from "./components/GroupInfo/GroupInfo";
import PostList from "./components/PostList/PostList";
import PostView from "./components/PostView/PostView";
import GroupForm from "./components/GroupForm/GroupForm";
import PostForm from "./components/PostForm/PostForm";
import GroupActions from "./components/GroupActions/GroupActions";
import GroupList from "./components/GroupList/GroupList";
import RegisterForm from "./components/RegisterForm/RegisterForm";
import LoginForm from "./components/LoginForm/LoginForm";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import UserView from "./components/UserView/UserView";
import InboxView from "./components/InboxView/InboxView";
import MessageForm from "./components/MessageForm/MessageForm";
import MessageView from "./components/MessageView/MessageView";
import Sandbox from "./components/Sandbox";

const Wrapper = styled.div`
  max-width: 1260px;
  margin: auto;
  background-color: white;
  min-height: 100vh;
  padding: 30px;
`;

const Body = styled.div`
  background-color: #eff0f2;
  color: #333;
  position: absolute;
  right: 0;
  left: 0;
  top: 0;
  min-height: 100vh;
  font-family: "Open Sans", sans-serif;
  font-weight: 400;
`;

const Branding = styled.h1`
  margin: 0;
  padding: 10px 0;
`;

const Navigation = styled.nav`
  display: flex;
  justify-content: space-between;
  ul {
    display: flex;
    li {
      margin: 10px 20px;
      font-weight: bold;
      font-size: 1.25rem;
      &:last-of-type {
        margin-right: 0;
      }
    }
  }
`;

const StyledLink = styled(Link)`
  color: #4385f5;
  font-weight: bold;
  &:hover {
    text-decoration: underline;
  }
`;

const App = () => {
  const dispatch = useDispatch();

  const [sortBy, setSortBy] = useState("new");
  const [searchBy, setSearchBy] = useState("title");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const user = useSelector(state => {
    return state.user;
  });

  useEffect(() => {
    const initialize = async () => {
      const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
      if (loggedUser) {
        await dispatch(setUser(loggedUser));
      }

      await dispatch(initializePosts());
      await dispatch(initializeGroups());
      await dispatch(initializeFollows());
      setLoading(false);
    };

    initialize();
  }, []);

  useEffect(() => {
    dispatch(initializePostVotes());
    // dispatch(initializeCommentVotes());
    dispatch(initializeSubscriptions());
  }, [user, dispatch]);

  const handleSortBy = e => {
    const sortValue = e.target.value;
    setSortBy(sortValue);
  };

  const handleSearchBy = e => {
    const searchByValue = e.target.value;
    setSearchBy(searchByValue);
  };

  const handleSearchTerm = e => {
    const searchByValue = e.target.value;
    setSearchTerm(searchByValue);
  };

  const resetFilters = () => {
    setSearchBy("title");
    setSearchTerm("");
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    dispatch(logout());
  };

  return (
    <Router>
      <ScrollToTop />
      <Body>
        <div className="App">
          <Wrapper>
            <Navigation>
              <StyledLink to="/">
                <Branding>Hello! ^_^</Branding>
              </StyledLink>
              <ul>
                <li>
                  <StyledLink to="/groups">Groups</StyledLink>
                </li>
                <li>
                  <StyledLink to="/inbox">Inbox</StyledLink>
                </li>
                {user.username === null && (
                  <>
                    <li>
                      <StyledLink to="/login">Log in</StyledLink>
                    </li>
                    <li>
                      <StyledLink to="/register">Register</StyledLink>
                    </li>
                  </>
                )}
                {user.username !== null && (
                  <li>
                    Signed in as {user.username}{" "}
                    <StyledLink onClick={handleLogout} to="/">
                      {" "}
                      Logout
                    </StyledLink>
                  </li>
                )}
              </ul>
            </Navigation>

            <Switch>
              <Route exact path="/">
                <h2>Welcome to my Reddit clone! :)</h2>
              </Route>
            </Switch>

            <Switch>
              <Route exact path="/register">
                <RegisterForm />
              </Route>
              <Route exact path="/login">
                <LoginForm />
              </Route>
              <Route exact path="/users/:userId">
                <UserView />
              </Route>
              <Route exact path="/inbox/message">
                <MessageView />
              </Route>
              <Route exact path="/sandbox">
                <Sandbox />
              </Route>
            </Switch>

            <Switch>
              <Route exact path="/groups/:group">
                <GroupInfo />
              </Route>
            </Switch>

            <Switch>
              <Route exact path={["/", "/groups/:group"]}>
                <GroupActions />

                <div>
                  <strong>Sort posts by:</strong>
                  <select
                    name="sortBy"
                    id="sort-by"
                    onChange={handleSortBy}
                    value={sortBy}
                  >
                    <option value="new">New</option>
                    <option value="top">Top</option>
                    <option value="followers">Followers</option>
                    <option value="commentsDesc">Comments (high to low)</option>
                    <option value="commentsAsc">Comments (low to high)</option>
                  </select>
                  <strong>
                    Search posts by{" "}
                    <select
                      name="searchOption"
                      id="search-option"
                      onChange={handleSearchBy}
                      value={searchBy}
                    >
                      <option value="title">Title</option>
                      <option value="content">Content</option>
                    </select>
                    :{" "}
                  </strong>
                  <input onChange={handleSearchTerm} value={searchTerm}></input>
                  <button
                    className="button-small no-shadow ml-10"
                    onClick={resetFilters}
                  >
                    Clear search
                  </button>
                </div>
              </Route>
            </Switch>

            <Switch>
              <Route exact path="/creategroup">
                <GroupForm />
              </Route>
              <Route path="/create">
                <PostForm />
              </Route>
              {!loading && (
                <Route path="/groups/:group/:id">
                  <PostView />
                </Route>
              )}

              <Route exact path={["/groups/:group", "/"]}>
                <PostList
                  sortBy={sortBy}
                  searchBy={searchBy}
                  searchTerm={searchTerm}
                />
              </Route>
              <Route exact path="/groups">
                <GroupList />
              </Route>
              <Route exact path="/inbox">
                <InboxView />
              </Route>
              <Route exact path="/messages/compose">
                <MessageForm />
              </Route>
            </Switch>
          </Wrapper>
        </div>
      </Body>
    </Router>
  );
};

export default App;
