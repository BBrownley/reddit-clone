import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
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

const App = () => {
  const dispatch = useDispatch();

  useEffect(async () => {
    dispatch(initializePosts());
  }, []);

  return (
    <Router>
      <Body>
        <div className="App">
          <Wrapper>
            <Link to="/">
              <Branding>Hello! ^_^</Branding>
            </Link>

            <Switch>
              <Route exact path="/">
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
