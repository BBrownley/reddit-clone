import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useHistory } from "react-router-dom";

import messageService from "../../services/messages";

import moment from "moment";

import DeleteConfirmation from "../DeleteConfirmation/DeleteConfirmation";

import {
  Message,
  Sender,
  Time,
  Actions,
  MessageBody,
  ReplyForm
} from "./MessageView.elements";

import { Button } from "../shared/Button.elements";

import ButtonGroup from "../shared/ButtonGroup.elements";

export default function MessageView() {
  const [reply, setReply] = useState("");
  const [replyOpen, setReplyOpen] = useState(false);
  const [confirmDeletion, setConfirmDeletion] = useState(false);

  const location = useLocation();
  const history = useHistory();
  const currentUser = useSelector(state => state.user);

  const sendReply = () => {
    const message = {
      sender_id: currentUser.userId,
      recipient_id: location.state.senderId,
      content: reply,
      has_read: 0,
      subject: `Re: ${location.state.subject}`
    };
    messageService.send(message);
    history.push("/inbox");
  };

  const handleDeleteMessage = () => {
    messageService.deleteMessage(location.state.id);
    history.push("/inbox");
  };

  console.log(location.state);

  return (
    <Message>
      <h2>{location.state.subject}</h2>
      <div>
        <Sender>{location.state.sender || "Server"}</Sender> |{" "}
        <Time>
          {moment(location.state.time).format("MMMM Do YYYY, h:mm:ss a")}
        </Time>
      </div>
      <MessageBody className="message-body">{location.state.body}</MessageBody>
      <ButtonGroup>
        <li>
          <Link to="/inbox">Back</Link>
        </li>
        {location.state.sender ? (
          <li>
            <a onClick={() => setReplyOpen(true)}>Reply</a>
          </li>
        ) : (
          ""
        )}

        <div className="pos-rel">
          <li>
            <span onClick={() => setConfirmDeletion(true)}>Delete</span>
          </li>

          {confirmDeletion && (
            <DeleteConfirmation
              confirmDelete={() => handleDeleteMessage()}
              cancel={() => setConfirmDeletion(false)}
            />
          )}
        </div>
      </ButtonGroup>
      {replyOpen && (
        <ReplyForm>
          <textarea
            type="text"
            value={reply}
            onChange={e => setReply(e.target.value)}
          />
          <div className="reply-options">
            <Button onClick={() => setReplyOpen(false)} color="white">
              Cancel
            </Button>
            <Button onClick={sendReply} color="blue">
              Send
            </Button>
          </div>
        </ReplyForm>
      )}
    </Message>
  );
}
