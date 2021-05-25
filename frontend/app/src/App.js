import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { Body, Wrapper } from "./components/shared/Body.elements";

import { initializePosts } from "./reducers/postsReducer";
import { initializeUserPosts } from "./reducers/userPostsReducer";
import { initializeGroups } from "./reducers/groupsReducer";
import { initializeVotes as initializePostVotes } from "./reducers/userPostVotesReducer";
import { setUser, initializeFollows } from "./reducers/userReducer";
import { initializeSubscriptions } from "./reducers/groupSubscribesReducer";

import PostView from "./components/PostView/PostView";
import GroupForm from "./components/GroupForm/GroupForm";
import PostForm from "./components/PostForm/PostForm";
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
import Toast from "./components/Toast/Toast";
import SingleGroupView from "./components/SingleGroupView/SingleGroupView";
import Sandbox from "./components/Sandbox";

import redditto from "./redditto.png";
import HomePage from "./components/HomePage/HomePage";

const App = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  const user = useSelector(state => {
    return state.user;
  });

  const toast = useSelector(state => state.toast);

  useEffect(() => {
    const initialize = async () => {
      const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
      if (loggedUser) {
        dispatch(setUser(loggedUser));
        dispatch(initializePosts());
        dispatch(initializeFollows());
        dispatch(initializePostVotes());
        dispatch(initializeSubscriptions());
        console.log(loggedUser);
        dispatch(initializeUserPosts(loggedUser.userId));
      }

      setLoading(false);
    };

    initialize();
  }, []);

  // useEffect(() => {
  //   dispatch(initializePostVotes());
  //   dispatch(initializeSubscriptions());
  //   dispatch(initializeUserPosts(user.userId));
  // }, [user]);

  return (
    <Router>
      <ScrollToTop />
      <Body>
        <div className="App">
          <Wrapper>
            <Toast message={toast} />
            <Navigation />
            {!loading && (
              <Switch>
                <Route exact path="/">
                  <HomePage />
                </Route>

                <Route exact path="/register" component={RegisterForm} />
                <Route exact path="/login" component={LoginForm} />
                <Route exact path="/users/:userId" component={UserView} />
                <Route exact path="/inbox/message" component={MessageView} />
                <Route exact path="/sandbox" component={Sandbox} />

                <Route exact path={["/groups/:group"]}>
                  <SingleGroupView />
                </Route>

                <Route exact path="/creategroup" component={GroupForm} />
                <Route path="/create" component={PostForm} />

                <Route path="/groups/:group/:id" component={PostView} />

                <Route exact path="/groups" component={GroupList} />
                <Route exact path="/inbox" component={InboxView} />
                <Route exact path="/messages/compose" component={MessageForm} />

                <Route component={NotFound} />
              </Switch>
            )}
          </Wrapper>
        </div>
      </Body>
    </Router>
  );
};

export default App;
