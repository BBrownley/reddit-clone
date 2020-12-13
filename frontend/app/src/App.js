import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch
} from "react-router-dom";
import styled from "styled-components";

import { initializePosts } from "./reducers/postsReducer";

import PostList from "./components/PostList";
import PostView from "./components/PostView";

import postService from "./services/posts";

const Wrapper = styled.div`
  max-width: 1260px;
  margin: auto;
  background-color: white;
  min-height: 100vh;
  padding: 10px;
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

const GroupInfo = styled.div`
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.1rem;
`;

const App = () => {
  const dispatch = useDispatch();

  const [sortBy, setSortBy] = useState("new");

  useEffect(async () => {
    dispatch(initializePosts());
  }, []);

  const handleSortBy = e => {
    const sortValue = e.target.value;
    setSortBy(sortValue);
  };

  return (
    <Router>
      <Body>
        <div className="App">
          <Wrapper>
            <Link to="/groups/all">
              <Branding>Hello! ^_^</Branding>
            </Link>
            <GroupInfo>
              <h1>General</h1>
              <p>1272 subscribers</p>
            </GroupInfo>

            <div>
              <strong>Sort posts by:</strong>
              <select name="sortBy" id="sort-by" onChange={handleSortBy}>
                <option value="new" selected>
                  New
                </option>
                <option value="top">Top</option>
                <option value="followers">Followers</option>
                <option value="commentsDesc">Comments (high to low)</option>
                <option value="commentsAsc">Comments (low to high)</option>
              </select>
            </div>

            <Switch>
              <Route path="/groups/:group">
                <PostList />
              </Route>
              <Route path="/groups/:group/:id">
                <PostView />
              </Route>
            </Switch>
          </Wrapper>
        </div>
      </Body>
    </Router>
  );
};

export default App;
