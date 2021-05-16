import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch, Link, useHistory } from "react-router-dom";

import moment from "moment";

import commentsService from "../../services/comments";
import messageService from "../../services/messages";

import {
  removeVote,
  vote,
  changeVote
} from "../../reducers/commentVotesReducer";
import { setRedirectPath } from "../../reducers/redirectReducer";

import BookmarkButton from "../BookmarkButton/BookmarkButton";
import DeleteConfirmation from "../DeleteConfirmation/DeleteConfirmation";

import {
  Container,
  MainContent,
  CommentVotes,
  CommentAge,
  ReplyForm,
  ReplyInput,
  CommentVoteButton
} from "./Comment.elements";

import ButtonGroup from "../shared/ButtonGroup.elements";

export default function Comment(props) {
  const level = props.level || 1;
  const currentCommentId = props.comment.comment_id;

  const currentUser = useSelector(state => state.user);
  const userCommentVotes = useSelector(state => state.userCommentVotes);
  const userBookmark = useSelector(state =>
    state.userBookmarks.find(
      bookmark => bookmark.comment_id === props.comment.comment_id
    )
  );

  const userBookmarked = !!userBookmark;

  const existingCommentVote = userCommentVotes.find(
    userCommentVote => userCommentVote.comment_id === currentCommentId
  );

  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(props.comment.content);
  const [children, setChildren] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [content, setContent] = useState(props.comment.content);
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  const [removed, setRemoved] = useState(
    parseInt(props.comment.deleted) === 1 ? true : false
  );
  const [commentScore, setCommentScore] = useState(
    props.comment.comment_score || 0
  );
  const [replyFormWarning, setReplyFormWarning] = useState(null);

  const match = useRouteMatch("/groups/:groupName/:groupId");

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const fetchChildren = async () => {
      const children = await commentsService.getCommentChildren(
        props.comment.comment_id
      );
      setChildren(children);
    };
    fetchChildren();
  }, [existingCommentVote, props.comment.comment_id]);

  useEffect(() => {
    setReplyFormWarning(null);
  }, [newComment]);

  /*
    Whenever a user replies to a comment, notify the user who was replied to

    repliedUser - ID of the user who was replied to
    newComment - Comment that was written in response to the replied user
  */
  const sendNotificationToRepliedUser = (repliedUser, newComment) => {
    // Prevent user from notifying themselves

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
    if (currentUser.userId === null) {
      dispatch(setRedirectPath(window.location.pathname));
      history.push({
        pathname: "/login",
        state: { headerMessage: "Log in to vote on comments" }
      });
      return;
    }

    if (existingCommentVote) {
      if (
        (existingCommentVote.vote_value === 1 && action === "upvote") ||
        (existingCommentVote.vote_value === -1 && action === "downvote")
      ) {
        dispatch(removeVote(currentCommentId));
      } else {
        const newVoteValue = action === "upvote" ? 1 : -1;

        dispatch(changeVote(currentCommentId, newVoteValue));
      }
    } else {
      if (action === "upvote") {
        dispatch(vote(currentCommentId, 1));
      } else {
        dispatch(vote(currentCommentId, -1));
      }
    }
    const updatedScore = await commentsService.getCommentScoreById(
      props.comment.comment_id
    );

    setCommentScore(updatedScore);
  };

  const handleEditComment = () => {
    if (editValue.trim().length === 0) {
      return console.log("Updated comment cannot be empty");
    }

    setEditing(false);
    setContent(editValue);
    commentsService.editComment(props.comment.comment_id, editValue);
  };

  const handleRemoveComment = async () => {
    setRemoved(true);
    commentsService.remove(props.comment.comment_id);
  };

  const handleReplyComment = () => {
    if (newComment.trim().length === 0) {
      return setReplyFormWarning("Cannot be empty");
    }

    props.handleSubmitComment(
      currentUser,
      newComment,
      match.params.groupId,
      props.comment.comment_id,
      true,
      children,
      setChildren
    );
    sendNotificationToRepliedUser(props.comment.commenter_id, newComment);
    setReplying(false);
    setNewComment("");
  };

  const handleSetReplying = () => {
    if (currentUser.userId === null) {
      dispatch(setRedirectPath(window.location.pathname));
      history.push({
        pathname: "/login",
        state: { headerMessage: "Log in to reply to comments" }
      });
    }
    setReplying(true);
  };

  const userOwnsComment = currentUser.userId === props.comment.commenter_id;

  return (
    <Container child={props.child} key={props.comment.comment_id}>
      {/* <div>
        <img
          src="https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png"
          width="35"
          height="35"
          alt="user profile image"
        ></img>
      </div> */}
      <MainContent>
        <Link to={`/users/${props.comment.user_id}`}>
          {props.comment.username}
        </Link>
        <span className="comment">{removed ? "Comment removed" : content}</span>
        {!removed && (
          <div className="comment-options">
            <CommentVotes>
              <CommentVoteButton
                name="thumbs-up"
                onClick={() => handleVoteComment("upvote")}
                upvoted={existingCommentVote?.vote_value === 1 ? 1 : 0}
              />
              <span>{commentScore}</span>
              <CommentVoteButton
                name="thumbs-down"
                onClick={() => handleVoteComment("downvote")}
                downvoted={existingCommentVote?.vote_value === -1 ? 1 : 0}
              />
            </CommentVotes>

            {!removed && currentUser.userId !== null && (
              <ButtonGroup>
                {replying === false && (
                  <li onClick={() => handleSetReplying()}>
                    <span className="reply">Reply</span>
                  </li>
                )}
                <BookmarkButton
                  bookmarked={userBookmarked}
                  commentId={props.comment.comment_id}
                />
                {userOwnsComment && (
                  <>
                    <li onClick={() => setConfirmDeletion(true)}>Delete</li>
                    {confirmDeletion && (
                      <DeleteConfirmation
                        confirmDelete={() => handleRemoveComment()}
                        cancel={() => setConfirmDeletion(false)}
                      />
                    )}
                    <li onClick={() => setEditing(true)}>Edit</li>
                  </>
                )}
                {replying === true && (
                  <ReplyForm>
                    <ReplyInput
                      type="text"
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                    />
                    <div className="form-bottom">
                      <div>
                        <button onClick={() => handleReplyComment()}>
                          Send
                        </button>
                        <a onClick={() => setReplying(false)}>Cancel</a>
                      </div>
                      <span className="warning">{replyFormWarning}</span>
                    </div>
                  </ReplyForm>
                )}
                {editing === true && (
                  <div>
                    <input
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                    />
                    <button onClick={() => handleEditComment()}>
                      Edit comment
                    </button>
                    <p
                      onClick={() => {
                        setEditing(false);
                        setEditValue(content);
                      }}
                    >
                      Cancel
                    </p>
                  </div>
                )}
              </ButtonGroup>
            )}
          </div>
        )}
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
          key={childComment.comment_id}
        />
      ))}
    </Container>
  );
}
