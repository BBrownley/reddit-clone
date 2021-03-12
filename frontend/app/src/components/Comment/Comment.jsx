import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch, Link, useHistory } from "react-router-dom";

import moment from "moment";

import FontAwesome from "react-fontawesome";

import commentsService from "../../services/comments";
import messageService from "../../services/messages";

import { removeVote } from "../../reducers/commentVotesReducer";

import {
  Container,
  MainContent,
  CommentVotes,
  CommentAge,
  ReplyForm,
  ReplyInput,
  CommentVoteButton
} from "./Comment.elements";

export default function Comment(props) {
  const level = props.level || 1;

  const [replying, setReplying] = useState(false);
  const [children, setChildren] = useState([]);
  const [newComment, setNewComment] = useState("");

  const history = useHistory();
  const match = useRouteMatch("/groups/:groupName/:groupId");

  const dispatch = useDispatch();

  const currentUser = useSelector(state => state.user);
  const userCommentVotes = useSelector(state => state.userCommentVotes);

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

  const currentCommentId = props.comment.comment_id;
  const existingCommentVote = userCommentVotes.find(
    userCommentVote => userCommentVote.comment_id === currentCommentId
  );

  // Handles comment voting when the thumbs up or thumbs down is clicked
  const handleVoteComment = action => {
    if (existingCommentVote) {
      console.log(existingCommentVote);

      if (
        (existingCommentVote.vote_value === 1 && action === "upvote") ||
        (existingCommentVote.vote_value === -1 && action === "downvote")
      ) {
        dispatch(removeVote(currentCommentId));
      } else {
        console.log("change vote");
      }
    } else {
      if (action === "upvote") {
        console.log("upvote comment");
      } else {
        console.log("downvote comment");
      }
    }
  };

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
            <CommentVoteButton
              name="thumbs-up"
              onClick={() => handleVoteComment("upvote")}
              upvoted={existingCommentVote?.vote_value === 1 ? true : false}
            />
            <span>{props.comment.comment_score}</span>
            <CommentVoteButton
              name="thumbs-down"
              onClick={() => handleVoteComment("downvote")}
              downvoted={existingCommentVote?.vote_value === -1 ? true : false}
            />
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
