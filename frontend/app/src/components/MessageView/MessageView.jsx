import React, { useEffect } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";

import {
  Message,
  Sender,
  Time,
  Actions,
  MessageBody
} from "./MessageView.elements";

export default function MessageView() {
  const location = useLocation();
  const history = useHistory();

  return (
    <Message>
      <h2>{location.state.subject}</h2>
      <div>
        <Sender>{location.state.sender || "Server"}</Sender> |{" "}
        <Time>{location.state.time}</Time>
      </div>
      <MessageBody>{location.state.body}</MessageBody>
      <Actions>
        <Link to="/inbox">Back</Link>
        {location.state.sender ? <Link>Reply</Link> : ""}
      </Actions>
    </Message>
  );
}
