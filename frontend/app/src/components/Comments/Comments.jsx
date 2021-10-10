import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link } from "react-router-dom";

import { setRedirectPath } from "../../reducers/redirectReducer";
import { initializeBookmarks } from "../../reducers/userBookmarksReducer";

import { Container, StyledFormContainer } from "./Comments.elements";
import { FormContainer, FormField } from "../shared/Form.elements";
import ButtonGroup from "../shared/ButtonGroup.elements";
import FollowButton from "../FollowButton/FollowButton";

import commentsService from "../../services/comments";
import postService from "../../services/posts";

import Comment from "../Comment/Comment";
import messageService from "../../services/messages";

export default function Comments({ postId, submitterId, postTitle }) {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user);
  const history = useHistory();

  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [newCommentFormError, setNewCommentFormError] = useState(null);

  useEffect(() => {
    // Fetch root comments, its respective component will render its children recursively
    const fetchComments = async () => {
      const comments = await commentsService.getRootCommentsByPostId(postId);
      setComments(comments);
    };

    const getCommentCount = async () => {
      const post = await postService.getPostById(postId);
      setCommentCount(post.total_comments);
    };

    fetchComments();
    getCommentCount();
  }, []);

  useEffect(() => {
    setNewCommentFormError(null);
  }, [newComment]);

  const handleSubmitComment = async (
    user,
    content,
    postId,
    repliedCommentId = null,
    replying = false,
    children = null,
    setChildren = null
  ) => {
    if (content.trim().length === 0) {
      return setNewCommentFormError("Comment cannot be empty");
    }

    const newCommentObj = await commentsService.add(
      user,
      content,
      postId,
      repliedCommentId || null
    );
    if (replying) {
      setChildren([...children, newCommentObj]);
    } else {
      // Not replying to a comment, begin a new thread
      setComments([...comments, newCommentObj]);
      setNewComment("");
      sendNotifications(user, content);
    }

    setCommentCount(prevState => prevState + 1);
  };

  // Will send a notification to the post author and those who are following the post
  const sendNotifications = (commentingUser, newComment) => {
    const message = {
      sender_id: null,
      recipient_id: submitterId,
      content: newComment,
      has_read: 0,
      subject: `User ${commentingUser.username} has responded to a post: ${postTitle}`
    };

    // Send a message to everyone following the post
    messageService.sendAll(message, postId);

    // Prevent sending a message to user if they're commenting on their own post
    if (commentingUser.userId === submitterId) return;

    messageService.send(message);
  };

  const handleLoginRedirect = () => {
    const originalPath = window.location.pathname;
    dispatch(setRedirectPath(originalPath));
    history.push("/login");
  };

  return (
    <Container>
      {(() => {
        if (!currentUser) {
          return (
            <>
              <Link onClick={handleLoginRedirect}>Log in</Link> to post a
              comment
            </>
          );
        } else {
          return (
            <StyledFormContainer className="new-thread">
              <FormField>
                <textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                />
              </FormField>
              <h3 className="warning">{newCommentFormError}</h3>
              <ButtonGroup>
                <li
                  className="active"
                  onClick={() =>
                    handleSubmitComment(currentUser, newComment, postId)
                  }
                >
                  Add comment
                </li>
              </ButtonGroup>
            </StyledFormContainer>
          );
        }
      })()}
      {comments.length === 0 ? (
        <h2>Be the first one to comment!</h2>
      ) : (
        <>
          <h2>Comments ({commentCount}):</h2>
          {comments
            .sort((a, b) => {
              return a.parent_id > b.parent_id ? -1 : 1;
            })
            .map(comment => {
              return (
                <Comment
                  comment={comment}
                  handleSubmitComment={handleSubmitComment}
                  key={comment.comment_id}
                />
              );
            })}
        </>
      )}
    </Container>
  );
}
