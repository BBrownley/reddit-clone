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
import FontAwesome from "react-fontawesome";

import { initializePosts } from "./reducers/postsReducer";

import PostList from "./components/PostList";
import PostView from "./components/PostView";

import postService from "./services/posts";

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

const GroupInfo = styled.div`
  /* background-color: #888; */
  /* text-align: center;
  margin: 20px 0;
  font-size: 1.1rem; */
  /* display: flex; */
  text-align: center;

  .group-desc {
    max-width: 80ch;
    margin: auto;
    margin-top: 10px;
  }
  .group-info-main {
    /* background-color: red; */
    /* text-align: left; */
    /* flex: 2; */
  }
  .group-actions {
    /* background-color: green; */
    display: flex;
    margin: 30px 0;

    justify-content: space-between;
    & > * {
      flex: 1;
      margin-right: 2rem;
    }
    & > *:last-child {
      margin-right: 0;
    }
  }
`;

const Navigation = styled.nav`
  /* background-color: #555; */
  display: flex;
  justify-content: space-between;
  ul {
    display: flex;
    li {
      margin: 10px 20px;
      font-weight: bold;
      color: #4385f5;
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
            <Navigation>
              <StyledLink to="/groups/all">
                <Branding>Hello! ^_^</Branding>
              </StyledLink>
              <ul>
                <li>
                  <StyledLink>Groups</StyledLink>
                </li>
                <li>
                  <StyledLink>Log in</StyledLink>
                </li>
                <li>
                  <StyledLink>Register</StyledLink>
                </li>
              </ul>
            </Navigation>

            <Switch>
              <Route exact path="/groups/:group">
                <GroupInfo>
                  <div className="group-info-main">
                    <h1>General</h1>
                    <p>1272 subscribers</p>
                    <p className="group-desc">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Etiam dapibus turpis nec libero ornare, ut pharetra orci
                      bibendum. Sed nec eros aliquet, sodales nunc sit amet,
                      fringilla purus. Aliquam ac nunc aliquam, sollicitudin
                      lorem sit amet, dapibus arcu. Donec mollis diam id lorem
                      vestibulum.
                    </p>
                  </div>
                  <div className="group-actions">
                    <button>
                      <FontAwesome name="paper-plane"></FontAwesome> Submit a
                      new post
                    </button>
                    <button>
                      <FontAwesome name="bell"></FontAwesome> Subscribe
                    </button>
                    <button>
                      <FontAwesome name="info-circle"></FontAwesome> More Info
                    </button>
                  </div>
                </GroupInfo>

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
                    <select name="searchOption" id="search-option">
                      <option>Title</option>
                      <option>Content</option>
                    </select>
                    :{" "}
                  </strong>
                  <input></input>
                </div>
              </Route>
            </Switch>

            <Switch>
              <Route path="/groups/:group/:id">
                <PostView />
              </Route>
              <Route path="/groups/:group">
                <PostList sortBy={sortBy} />
              </Route>
            </Switch>
          </Wrapper>
        </div>
      </Body>
    </Router>
  );
};

export default App;
