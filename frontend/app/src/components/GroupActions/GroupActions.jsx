import React from "react";
import { useSelector, useDispatch } from "react-redux";
import FontAwesome from "react-fontawesome";
import { useHistory, useRouteMatch } from "react-router-dom";

import {
  subscribeToGroup,
  unsubscribeFromGroup
} from "../../reducers/groupSubscribesReducer";
import { setRedirectPath } from "../../reducers/redirectReducer";

import {
  GroupActions as Container,
  CreatePostButton
} from "./GroupActions.elements";

const GroupActions = ({ group }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const loggedUser = useSelector(state => state.user);
  const userSubscribedGroups = useSelector(state => state.subscribedGroups);

  const groupMatch = useRouteMatch("/groups/:groupName");

  const handleCreatePostButton = () => {
    if (loggedUser.userId !== null) {
      history.push(`/create?group=${group.group_name}`);
    } else {
      dispatch(setRedirectPath("/create"));
      history.push({
        pathname: "/login",
        state: { headerMessage: "Log in to create a post", creatingPost: true }
      });
    }
  };

  const handleSubscribe = () => {
    if (loggedUser.userId !== null) {
      dispatch(subscribeToGroup(group, loggedUser));
    } else {
      history.push({
        pathname: "/login",
        state: {
          headerMessage: "Log in to subscribe to your favorite groups",
          subscribingToGroup: true
        }
      });
    }
  };

  const handleUnsubscribe = () => {
    dispatch(unsubscribeFromGroup(group, loggedUser));
  };

  return (
    <Container singleGroup={!group}>
      <button
        onClick={handleCreatePostButton}
        className="create-post-button primary"
      >
        <FontAwesome name="paper-plane"></FontAwesome> Submit a new post
      </button>

      {group &&
        loggedUser.token &&
        (userSubscribedGroups.find(userGroup => {
          return userGroup.group_id === group.group_id;
        }) ? (
          <button onClick={handleUnsubscribe} className="primary">
            <FontAwesome name="check"></FontAwesome>
            {" SUBSCRIBED"}
          </button>
        ) : (
          <button onClick={handleSubscribe} className="primary">
            <FontAwesome name="bell"></FontAwesome>
            {" Subscribe"}
          </button>
        ))}
    </Container>
  );
};

export default GroupActions;
