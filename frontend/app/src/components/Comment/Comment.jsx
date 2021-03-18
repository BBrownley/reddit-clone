import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch, Link, useHistory } from "react-router-dom";

import moment from "moment";
import _ from "lodash";

import FontAwesome from "react-fontawesome";

import commentsService from "../../services/comments";
import messageService from "../../services/messages";

import {
  removeVote,
  vote,
  changeVote
} from "../../reducers/commentVotesReducer";

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
  const currentCommentId = props.comment.comment_id;

  const currentUser = useSelector(state => state.user);
  const userCommentVotes = useSelector(state => state.userCommentVotes);

  const existingCommentVote = userCommentVotes.find(
    userCommentVote => userCommentVote.comment_id === currentCommentId
  );

  const [replying, setReplying] = useState(false);
  const [children, setChildren] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [initialVoteValue, setInitialVoteValue] = useState(0);
  const [commentScoreDelta, setCommentScoreDelta] = useState(0);

  

  const history = useHistory();
  const match = useRouteMatch("/groups/:groupName/:groupId");

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchChildren = async () => {
      const children = await commentsService.getCommentChildren(
        props.comment.comment_id
      );
      setChildren(children);
    };
    fetchChildren();

    if (existingCommentVote) {
      setInitialVoteValue(existingCommentVote.vote_value);
    }
  }, []);

  /*
    Whenever a user replies to a comment, notify the user who was replied to

    repliedUser - ID of the user who was replied to
    newComment - Comment that was written in response to the replied user
  */
  const sendNotificationToRepliedUser = (repliedUser, newComment) => {
    // Prevent user from notifying themselves

    console.log(repliedUser);
    console.log(currentUser.userId);

    if (repliedUser === currentUser.userId) return;

    const message = {
      sender_id: null,
      recipient_id: repliedUser,
      content: newComment,
      has_read: 0,
      subject: `User ${currentUser.username} has replied to a comment`
    };
    messageService.send(message);
  };

  // Handles comment voting when the thumbs up or thumbs down is clicked
  const handleVoteComment = async action => {
    if (existingCommentVote) {
      if (
        (existingCommentVote.vote_value === 1 && action === "upvote") ||
        (existingCommentVote.vote_value === -1 && action === "downvote")
      ) {
        console.log("removing vote");
        dispatch(removeVote(currentCommentId));
        setCommentScoreDelta(
          existingCommentVote.vote_value === 1
            ? commentScoreDelta - 1
            : commentScoreDelta + 1
        );
      } else {
        console.log("change vote");
        const newVoteValue = action === "upvote" ? 1 : -1;

        console.log(newVoteValue);

        dispatch(changeVote(currentCommentId, newVoteValue));

        const newScoreDelta = () => {
          if (initialVoteValue === 0) {
            return action === "upvote" ? 1 : -1;
          } else if (initialVoteValue === 1) {
            return action === "upvote" ? 0 : -2;
          } else {
            return action === "upvote" ? 2 : 0;
          }
        };

        setCommentScoreDelta(newScoreDelta());
      }
    } else {
      if (action === "upvote") {
        const newScoreDelta = () => {
          if (initialVoteValue === 0) {
            return 1;
          } else if (initialVoteValue === 1) {
            return 0;
          } else {
            // -1
            return 2;
          }
        };

        console.log("upvote");
        dispatch(vote(currentCommentId, 1));
        setCommentScoreDelta(newScoreDelta);
      } else {
        const newScoreDelta = () => {
          if (initialVoteValue === 0) {
            return -1;
          } else if (initialVoteValue === 1) {
            return -2;
          } else {
            // -1
            return 0;
          }
        };

        console.log("downvote");
        dispatch(vote(currentCommentId, -1));
        setCommentScoreDelta(newScoreDelta());
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
      <p>{initialVoteValue}</p>
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
            <span>{props.comment.comment_score + commentScoreDelta}</span>
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
                  setNewComment("");
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
