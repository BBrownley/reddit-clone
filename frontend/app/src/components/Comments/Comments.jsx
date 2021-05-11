import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link } from "react-router-dom";

import { setRedirectPath } from "../../reducers/redirectReducer";
import { initializeBookmarks } from "../../reducers/userBookmarksReducer";

import commentsService from "../../services/comments";

import Comment from "../Comment/Comment";
import messageService from "../../services/messages";

export default function Comments({ postId, authorId, postTitle }) {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user);
  const history = useHistory();

  const [comments, setComments] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    // Fetch root comments, its respective component will render its children recursively
    const fetchComments = async () => {
      const comments = await commentsService.getRootCommentsByPostId(postId);
      console.log(comments);
      setComments(comments);
    };

    fetchComments();
  }, []);

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
      return console.log("Comment cannot be empty");
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
      setFormOpen(false);
      setNewComment("");
      sendNotifications(user, content);
    }
  };

  // Will send a notification to the post author and those who are following the post
  const sendNotifications = (commentingUser, newComment) => {
    const message = {
      sender_id: null,
      recipient_id: authorId,
      content: newComment,
      has_read: 0,
      subject: `User ${commentingUser.username} has responded to a post: ${postTitle}`
    };
    messageService.send(message);
    messageService.sendAll(message, postId);
  };

  const handleLoginRedirect = () => {
    const originalPath = window.location.pathname;
    dispatch(setRedirectPath(originalPath));
    history.push("/login");
  };

  return (
    <div>
      {(() => {
        if (!currentUser) {
          return (
            <>
              <Link onClick={handleLoginRedirect}>Log in</Link> to post a
              comment
            </>
          );
        } else if (formOpen) {
          return (
            <>
              <input
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
              />
              <button
                onClick={() =>
                  handleSubmitComment(currentUser, newComment, postId)
                }
              >
                Submit
              </button>
              <p onClick={() => setFormOpen(false)}>Cancel</p>
            </>
          );
        } else {
          return (
            <button
              onClick={() => {
                if (currentUser.token === null) {
                  dispatch(setRedirectPath(window.location.pathname));
                  history.push({
                    pathname: "/login",
                    state: { headerMessage: "Log in to comment on this post" }
                  });
                }
                setFormOpen(true);
              }}
            >
              Add a comment
            </button>
          );
        }
      })()}
      {comments.length === 0 ? (
        <h2>Be the first one to comment!</h2>
      ) : (
        <>
          <h2>Comments:</h2>
          {comments
            .sort((a, b) => {
              return a.parent_id > b.parent_id ? 1 : -1;
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
    </div>
  );
}
