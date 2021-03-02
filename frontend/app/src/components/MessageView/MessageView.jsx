import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useHistory } from "react-router-dom";

import messageService from "../../services/messages";

import {
  Message,
  Sender,
  Time,
  Actions,
  MessageBody
} from "./MessageView.elements";

export default function MessageView() {
  const [reply, setReply] = useState("");
  const [replyOpen, setReplyOpen] = useState(false);

  const location = useLocation();
  const history = useHistory();
  const currentUser = useSelector(state => state.user);

  const sendReply = () => {
    const message = {
      sender_id: currentUser.userId,
      recipient_id: location.state.sender,
      content: reply,
      has_read: 0,
      subject: `Re: ${location.state.subject}`
    };
    messageService.send(message);
    history.push("/inbox");
  };

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
        {location.state.sender ? (
          <a onClick={() => setReplyOpen(true)}>Reply</a>
        ) : (
          ""
        )}
      </Actions>
      {replyOpen && (
        <>
          <input
            type="text"
            value={reply}
            onChange={e => setReply(e.target.value)}
          />
          <button onClick={sendReply}>Send</button>
        </>
      )}
    </Message>
  );
}
