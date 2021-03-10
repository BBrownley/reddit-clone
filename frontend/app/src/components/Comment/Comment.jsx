import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouteMatch, Link, useHistory } from "react-router-dom";

import moment from "moment";

import FontAwesome from "react-fontawesome";

import commentsService from "../../services/comments";
import messageService from "../../services/messages";

import {
  Container,
  MainContent,
  CommentVotes,
  CommentAge,
  ReplyForm,
  ReplyInput
} from "./Comment.elements";

export default function Comment(props) {
  const level = props.level || 1;

  const [replying, setReplying] = useState(false);
  const [children, setChildren] = useState([]);
  const [newComment, setNewComment] = useState("");

  const history = useHistory();
  const match = useRouteMatch("/groups/:groupName/:groupId");

  const currentUser = useSelector(state => state.user);

  useEffect(() => {
    const fetchChildren = async () => {
      const children = await commentsService.getCommentChildren(
        props.comment.comment_id
      );
      setChildren(children);
    };
    fetchChildren();
  }, []);

  const sendNotificationToRepliedUser = (repliedUser, newComment) => {
    const message = {
      sender_id: null,
      recipient_id: repliedUser,
      content: newComment,
      has_read: 0,
      subject: `User ${currentUser.username} has replied to a comment`
    };
    messageService.send(message);
  };

  const handleUpvoteComment = () => {

  }

  const handleDownvoteComment = () => {
    
  }

  return (
    <Container child={props.child}>
      <div>
        <img
          src="https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png"
          width="35"
          height="35"
        ></img>
      </div>
      <MainContent>
        <Link to={`/users/${props.comment.user_id}`}>
          {props.comment.username}
        </Link>
        <span class="comment">{props.comment.content}</span>
        <p>
          <CommentVotes>
            <FontAwesome name="arrow-circle-up" />
            <span>{props.comment.comment_score}</span>
            <FontAwesome name="arrow-circle-down" />
          </CommentVotes>
          {replying === false && (
            <span onClick={() => setReplying(true)}>
              <a className="reply">Reply</a>
            </span>
          )}
          <a href="#">Bookmark</a>
          <a href="#">Delete</a>
          {replying === true && (
            <ReplyForm>
              <ReplyInput
                type="text"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
              />
              <button
                onClick={() => {
                  props.handleSubmitComment(
                    currentUser,
                    newComment,
                    match.params.groupId,
                    props.comment.comment_id,
                    true,
                    children,
                    setChildren
                  );
                  sendNotificationToRepliedUser(
                    props.comment.commenter_id,
                    newComment
                  );
                  setReplying(false);
                }}
              >
                Send
              </button>
              <a onClick={() => setReplying(false)}>Cancel</a>
            </ReplyForm>
          )}
        </p>
      </MainContent>
      <CommentAge>
        <span>{moment(props.comment.created_at).fromNow()}</span>
      </CommentAge>

      {children.map(childComment => (
        <Comment
          comment={childComment}
          handleSubmitComment={props.handleSubmitComment}
          child={true}
          level={level + 1}
        />
      ))}
    </Container>
  );
}
