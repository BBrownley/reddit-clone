import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { Body, Wrapper } from "./components/shared/Body.elements";

import { initializePosts } from "./reducers/postsReducer";
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
import Sandbox from "./components/Sandbox";
import SingleGroupView from "./components/SingleGroupView/SingleGroupView";

const App = () => {
  const dispatch = useDispatch();

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
    dispatch(initializeSubscriptions());
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Body>
        <div className="App">
          <Wrapper>
            <Navigation />

            <Switch>
              <Route exact path="/">
                <h2>Welcome to my Reddit clone! :)</h2>
                <SingleGroupView all={true} />
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

              {!loading && (
                <Route path="/groups/:group/:id" component={PostView} />
              )}

              <Route exact path="/groups" component={GroupList} />
              <Route exact path="/inbox" component={InboxView} />
              <Route exact path="/messages/compose" component={MessageForm} />

              <Route component={NotFound} />
            </Switch>
          </Wrapper>
        </div>
      </Body>
    </Router>
  );
};

export default App;
