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

import { StyledPillButton as PillButton } from "./MessageView.elements";

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
      <ul className="message-actions">
        <li>
          <Link to="/inbox">
            <PillButton>Back</PillButton>
          </Link>
        </li>
        {location.state.sender ? (
          <li>
            <PillButton onClick={() => setReplyOpen(true)}>Reply</PillButton>
          </li>
        ) : (
          ""
        )}

        <div className="pos-rel">
          <li>
            <PillButton onClick={() => setConfirmDeletion(true)}>
              Delete
            </PillButton>
          </li>

          {confirmDeletion && (
            <DeleteConfirmation
              confirmDelete={() => handleDeleteMessage()}
              cancel={() => setConfirmDeletion(false)}
            />
          )}
        </div>
      </ul>
      {replyOpen && (
        <ReplyForm>
          <textarea
            type="text"
            value={reply}
            onChange={e => setReply(e.target.value)}
          />
          <div className="reply-options">
            <PillButton onClick={() => setReplyOpen(false)} color="white">
              Cancel
            </PillButton>
            <PillButton onClick={sendReply} className="send-btn">
              Send
            </PillButton>
          </div>
        </ReplyForm>
      )}
    </Message>
  );
}
