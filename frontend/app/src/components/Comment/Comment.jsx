import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch, Link, useHistory } from "react-router-dom";

import moment from "moment";

import commentsService from "../../services/comments";
import messageService from "../../services/messages";
import commentVotesService from "../../services/commentVotes";

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
  ReplyForm as CommentForm,
  ReplyInput as CommentFormInput,
  CommentVoteButton
} from "./Comment.elements";

import ButtonGroup from "../shared/ButtonGroup.elements";
import { PillButton } from "../shared/PillButton.elements";

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
  const [editValue, setEditValue] = useState(props.comment.comment_body);
  const [children, setChildren] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentBody, setCommentBody] = useState(props.comment.comment_body);
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  const [removed, setRemoved] = useState(
    parseInt(props.comment.deleted) === 1 ? true : false
  );
  const [commentScore, setCommentScore] = useState(
    props.comment.comment_score || 0
  );
  const [commentFormWarning, setCommentFormWarning] = useState(null);

  const match = useRouteMatch("/groups/:groupName/:postId");

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

  // Clear reply/edit form warning
  useEffect(() => {
    setCommentFormWarning(null);
  }, [newComment, editValue, replying, editing]);

  // Make it so both the reply form and edit form cannot be opened at the same time

  useEffect(() => {
    if (replying) setEditing(false);
  }, [replying]);

  useEffect(() => {
    if (editing) setReplying(false);
  }, [editing]);

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
        await commentVotesService.removeVote(currentCommentId);
      } else {
        const newVoteValue = action === "upvote" ? 1 : -1;
        dispatch(changeVote(currentCommentId, newVoteValue));
        await commentVotesService.changeVote(currentCommentId, newVoteValue);
      }
    } else {
      if (action === "upvote") {
        dispatch(vote(currentCommentId, 1, parseInt(match.params.postId)));
        await commentVotesService.vote(currentCommentId, 1);
      } else {
        dispatch(vote(currentCommentId, -1, parseInt(match.params.postId)));
        await commentVotesService.vote(currentCommentId, -1);
      }
    }
    const updatedScore = await commentsService.getCommentScoreById(
      props.comment.comment_id
    );

    setCommentScore(updatedScore);
  };

  const handleEditComment = () => {
    if (editValue.trim().length === 0) {
      return setCommentFormWarning("Updated comment cannot be empty");
    }

    setEditing(false);
    setCommentBody(editValue);
    commentsService.editComment(props.comment.comment_id, editValue);
  };

  const handleRemoveComment = async () => {
    setRemoved(true);
    setEditing(false);
    commentsService.remove(props.comment.comment_id);
  };

  const handleReplyComment = () => {
    if (newComment.trim().length === 0) {
      return setCommentFormWarning("Cannot be empty");
    }

    props.handleSubmitComment(
      currentUser,
      newComment,
      match.params.postId,
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
      <MainContent>
        <Link to={`/users/${props.comment.user_id}`} className="comment-user">
          {props.comment.username}
        </Link>
        <span className="comment">
          {removed ? "Comment removed" : commentBody}
        </span>
        {!removed && (
          <div className="comment-actions">
            <div>
              <CommentVotes>
                <CommentVoteButton
                  name="thumbs-up"
                  onClick={() => handleVoteComment("upvote")}
                  upvoted={existingCommentVote?.vote_value === 1 ? 1 : 0}
                />
                <span className="comment-score">{commentScore}</span>
                <CommentVoteButton
                  name="thumbs-down"
                  onClick={() => handleVoteComment("downvote")}
                  downvoted={existingCommentVote?.vote_value === -1 ? 1 : 0}
                />
              </CommentVotes>
            </div>

            {!removed && currentUser.userId !== null && (
              <>
                <ul className="reply-del-edit">
                  <div>
                    {replying === false && (
                      <li onClick={() => handleSetReplying()}>
                        <span className="reply">Reply</span>
                      </li>
                    )}
                  </div>
                  <div>
                    <BookmarkButton
                      bookmarked={userBookmarked}
                      commentId={props.comment.comment_id}
                    />
                  </div>
                  {userOwnsComment && (
                    <>
                      <div className="pos-rel">
                        <li onClick={() => setConfirmDeletion(true)}>Delete</li>
                        {confirmDeletion && (
                          <DeleteConfirmation
                            confirmDelete={() => handleRemoveComment()}
                            cancel={() => setConfirmDeletion(false)}
                          />
                        )}
                      </div>
                      <div>
                        <li onClick={() => setEditing(true)}>Edit</li>
                      </div>
                    </>
                  )}
                </ul>
              </>
            )}
          </div>
        )}
        {replying === true && (
          <CommentForm>
            <CommentFormInput
              type="text"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
            />
            <div className="form-bottom">
              <div>
                <PillButton onClick={() => handleReplyComment()} color="blue">
                  Send
                </PillButton>
                <PillButton onClick={() => setReplying(false)}>
                  Cancel
                </PillButton>
              </div>
              <span className="warning">{commentFormWarning}</span>
            </div>
          </CommentForm>
        )}
        {editing === true && (
          <CommentForm>
            <CommentFormInput
              type="text"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
            />
            <div className="form-bottom">
              <div>
                <PillButton onClick={() => handleEditComment()} color="blue">
                  Edit comment
                </PillButton>
                <PillButton onClick={() => setEditing(false)}>
                  Cancel
                </PillButton>
              </div>
              <span className="warning">{commentFormWarning}</span>
            </div>
          </CommentForm>
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
