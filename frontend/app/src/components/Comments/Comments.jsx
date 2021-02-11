import React, { useState, useEffect } from "react";
import commentsService from "../../services/comments";

import Comment from "../Comment/Comment";

export default function Comments({ postId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Fetch root comments, its respective component will render its children recursively
    const fetchComments = async () => {
      const comments = await commentsService.getRootCommentsByPostId(postId);
      setComments(comments);
    };
    fetchComments();
  }, []);

  return (
    <div>
      <button>Add a comment</button>
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
