import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link } from "react-router-dom";

import { setRedirectPath } from "../../reducers/redirectReducer";

import commentsService from "../../services/comments";

import Comment from "../Comment/Comment";

export default function Comments({ postId }) {
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
      setComments(comments);
    };
    fetchComments();
  }, []);

  const handleSubmitComment = async e => {
    e.preventDefault();
    //dispatch(newComment);
    await commentsService.add(currentUser, newComment, postId, null);
    setFormOpen(false);
    setNewComment("");
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
              <button onClick={handleSubmitComment}>Submit</button>
              <p onClick={() => setFormOpen(false)}>Cancel</p>
            </>
          );
        } else {
          return (
            <button onClick={() => setFormOpen(true)}>Add a comment</button>
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
              return <Comment comment={comment} />;
            })}
        </>
      )}
    </div>
  );
}
