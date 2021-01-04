import React from "react";
import FontAwesome from "react-fontawesome";
import { useHistory } from "react-router-dom";

const GroupActions = () => {
  const history = useHistory();

  const redirectToPostForm = () => {
    history.push("/create");
  };

  return (
    <div className="group-actions">
      <button onClick={redirectToPostForm}>
        <FontAwesome name="paper-plane"></FontAwesome> Submit a new post
      </button>

      <button>
        <FontAwesome name="bell"></FontAwesome> Subscribe
      </button>
      <button>
        <FontAwesome name="info-circle"></FontAwesome> More Info
      </button>
    </div>
  );
};

export default GroupActions;
