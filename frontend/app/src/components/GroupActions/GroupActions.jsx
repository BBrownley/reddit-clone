import React from "react";
import { useSelector } from "react-redux";
import FontAwesome from "react-fontawesome";
import { useHistory } from "react-router-dom";

import { GroupActions as Container } from "./GroupActions.elements";

const GroupActions = () => {
  const history = useHistory();
  const loggedUser = useSelector(state => state.user);

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
  
  return (
    <Container>
      <button onClick={handleCreatePostButton}>
        <FontAwesome name="paper-plane"></FontAwesome> Submit a new post
      </button>

      <button>
        <FontAwesome name="bell"></FontAwesome> Subscribe
      </button>
      <button>
        <FontAwesome name="info-circle"></FontAwesome> More Info
      </button>
    </Container>
  );
};

export default GroupActions;
