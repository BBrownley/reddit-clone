import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { Body, Wrapper } from "./components/shared/Body.elements";

import { initializePosts } from "./reducers/postsReducer";
import { initializeGroups } from "./reducers/groupsReducer";
import { initializeVotes as initializePostVotes } from "./reducers/userPostVotesReducer";
import { setUser, initializeFollows } from "./reducers/userReducer";
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
import Navigation from "./components/Navigation/Navigation";
import NotFound from "./components/NotFound/NotFound";
import Sandbox from "./components/Sandbox";

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

  return (
    <Router>
      <ScrollToTop />
      <Body>
        <div className="App">
          <Wrapper>
            <Navigation />
            <Route exact path="/">
              <h2>Welcome to my Reddit clone! :)</h2>
            </Route>

            <Route exact path="/register" component={RegisterForm} />
            <Route exact path="/login" component={LoginForm} />
            <Route exact path="/users/:userId" component={UserView} />
            <Route exact path="/inbox/message" component={MessageView} />
            <Route exact path="/sandbox" component={Sandbox} />

            <Route exact path="/groups/:group" component={GroupInfo} />

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

            <Route exact path="/creategroup" component={GroupForm} />
            <Route path="/create" component={PostForm} />

            {!loading && (
              <Route path="/groups/:group/:id" component={PostView} />
            )}

            <Route exact path={["/groups/:group", "/"]}>
              <PostList
                sortBy={sortBy}
                searchBy={searchBy}
                searchTerm={searchTerm}
              />
            </Route>
            <Route exact path="/groups" component={GroupList} />
            <Route exact path="/inbox" component={InboxView} />
            <Route exact path="/messages/compose" component={MessageForm} />

            <Route component={NotFound} />
          </Wrapper>
        </div>
      </Body>
    </Router>
  );
};

export default App;
