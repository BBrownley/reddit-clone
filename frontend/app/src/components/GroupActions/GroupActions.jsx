import React from "react";
import { useSelector, useDispatch } from "react-redux";
import FontAwesome from "react-fontawesome";
import { useHistory, useRouteMatch } from "react-router-dom";

import {
  subscribeToGroup,
  unsubscribeFromGroup
} from "../../reducers/groupSubscribesReducer";

import { GroupActions as Container } from "./GroupActions.elements";

const GroupActions = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const loggedUser = useSelector(state => state.user);
  const userSubscribedGroups = useSelector(state => state.subscribedGroups);

  const groupMatch = useRouteMatch("/groups/:groupName");
  const currentGroup = useSelector(state => {
    if (groupMatch) {
      return state.groups.find(group => {
        return (
          group.group_name.toLowerCase() ===
          groupMatch.params.groupName.toLowerCase()
        );
      });
    }
  });

  const handleCreatePostButton = () => {
    if (loggedUser) {
      history.push("/create");
    } else {
      history.push({
        pathname: "/login",
        state: { headerMessage: "Log in to create a post", creatingPost: true }
      });
    }
  };

  const handleSubscribe = () => {
    if (loggedUser) {
      console.log(`Subscribing to: ${currentGroup}`);
      console.log(currentGroup);
      dispatch(subscribeToGroup(currentGroup, loggedUser));
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
    console.log(currentGroup);
    dispatch(unsubscribeFromGroup(currentGroup, loggedUser));
    console.log("unsubbing");
  };

  return (
    <Container>
      <button onClick={handleCreatePostButton}>
        <FontAwesome name="paper-plane"></FontAwesome> Submit a new post
      </button>

      {groupMatch &&
        (userSubscribedGroups.find(group => group.id === currentGroup.id) ? (
          <button onClick={handleUnsubscribe}>
            <FontAwesome name="check"></FontAwesome>
            {" SUBSCRIBED"}
          </button>
        ) : (
          <button onClick={handleSubscribe}>
            <FontAwesome name="bell"></FontAwesome>
            {" Subscribe"}
          </button>
        ))}

      <button>
        <FontAwesome name="info-circle"></FontAwesome> More Info
      </button>
    </Container>
  );
};

export default GroupActions;
