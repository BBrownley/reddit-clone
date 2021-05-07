import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch, Link } from "react-router-dom";

import moment from "moment";

import commentsService from "../../services/comments";
import messageService from "../../services/messages";

import {
  removeVote,
  vote,
  changeVote
} from "../../reducers/commentVotesReducer";

import BookmarkButton from "../BookmarkButton/BookmarkButton";

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
    props.comment.deleted === "Y" ? true : false
  );

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
  }, [existingCommentVote, props.comment.comment_id]);

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
  };

  const handleEditComment = () => {
    setEditing(false);
    setContent(editValue);
    commentsService.editComment(props.comment.comment_id, editValue);
  };

  const handleRemoveComment = async () => {
    setRemoved(true);
    commentsService.remove(props.comment.comment_id);
  };

  const commentScore = props.comment.comment_score || 0;

  return (
    <Container child={props.child} key={props.comment.comment_id}>
      <div>
        <img
          src="https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png"
          width="35"
          height="35"
          alt="user profile image"
        ></img>
      </div>
      <MainContent>
        <Link to={`/users/${props.comment.user_id}`}>
          {props.comment.username}
        </Link>
        <span className="comment">{removed ? "Comment removed" : content}</span>
        {!removed && (
          <p>
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
            {replying === false && (
              <span onClick={() => setReplying(true)}>
                <a className="reply">Reply</a>
              </span>
            )}
            <BookmarkButton
              bookmarked={userBookmarked}
              commentId={props.comment.comment_id}
            />
            <button onClick={() => setConfirmDeletion(true)}>Delete</button>
            {confirmDeletion && (
              <>
                <span>Are you sure?</span>
                <span onClick={handleRemoveComment}>yes</span>
                <span onClick={() => setConfirmDeletion(false)}>no</span>
              </>
            )}
            <span onClick={() => setEditing(true)}>Edit</span>
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
          </p>
        )}
      </MainContent>
      <CommentAge>
        <span>{moment(props.comment.created_at).fromNow()}</span>
      </CommentAge>
      <p>{props.comment.comment_id}</p>

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
